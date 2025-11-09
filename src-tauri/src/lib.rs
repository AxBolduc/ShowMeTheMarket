mod commands;
use commands::*;
use tauri::{Emitter, Manager, Url};
#[cfg(desktop)]
use tauri_plugin_deep_link::DeepLinkExt;

fn process_deep_link_urls(app_handle: &tauri::AppHandle, urls: Vec<Url>) {
    println!("Deep link URLs received: {:?}", urls);
    let url = &urls[0];
    match url.query() {
        Some(q) => {
            println!("Query String: {:?}", q);
            match app_handle.emit("deep-link", q.to_string()) {
                Ok(_) => println!("Sent to Frontend"),
                Err(e) => println!("Failed to send to frontend"),
            }
        }
        None => println!("No query string for URL: {}", url.as_str()),
    }
    // You might still want to emit the raw URLs or a processed version to the FE
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            #[cfg(all(debug_assertions, windows))]
            app.deep_link().register_all()?;

            let start_urls = app.deep_link().get_current()?;
            if let Some(urls) = start_urls {
                // When app is started by deep link
                process_deep_link_urls(&app.handle(), urls);
            }

            let cloned_app_handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                // When app gets deep link when running
                println!("Called");
                let urls = event.urls();
                process_deep_link_urls(&cloned_app_handle, urls)
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
