import { getStubs } from "$lib/services/wallet";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({params}) => {
    const {data: stubs}  = await getStubs();

    return {
        stubs
    }
}