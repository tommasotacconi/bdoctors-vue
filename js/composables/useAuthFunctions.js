import { ref } from 'vue';
import axios from 'axios';
import { store } from '../store';
import { dashboardStore } from '../dashboardStore';

export function useAuthFunctions() {
    const isLoggingOut = ref(false);

    const logout = ({ inThenOperations, inCatchOperations, additionalOperations }) => {
        axios.post(store.apiUri.slice(0, -4) + 'logout',
            {
                withCredentials: true
            })
            .then(() => {
                store.isAuthenticated = false;
                dashboardStore.profileDataGeneral = {};
                inThenOperations?.();
            })
            .catch(() => {/* console.log(err); */ inCatchOperations?.();})
            .finally(() => isLoggingOut.value = false);

        isLoggingOut.value = true;
        additionalOperations?.();
    }

    return { isLoggingOut, logout }
}