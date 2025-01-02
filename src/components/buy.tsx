import {api} from "~/trpc/react";

function tf() {
    const {
        data: merchData,
        isLoading,
        isError,
    } = api.merchandise.purchaseMerch.useQuery();
}