import axios from 'axios';
const BACKEND_BASE_URL2 = 'http://localhost:8081/api/device';
const BACKEND_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/device`;
const axiosInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    timeout: 10000,
});

export const getChildAppsApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_apps/${childId}`;
    try{
        
        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        return response.data;
    }catch(error){
        console.error('Failed to get apps for child:', error);
        throw error;
    }

}  

export const updateChildAppsApi = async (childId, selectedProcessNames, idToken) => {
    const url = `${BACKEND_BASE_URL}/update_apps`;
    const payload = {
        childId: childId,
        appList: selectedProcessNames,
    };
    try{
        await axiosInstance.post(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
    }catch(error){
        console.error('Failed to save apps for child:', error);
        throw error;
    }
}

export const getChildSitesApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_sites/${childId}`;
    try{
        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
        return response.data;
    }catch(error){
        console.error('Failed to get sites for child:', error);
        throw error;
    }
}

export const updateChildSitesApi = async (childId, selectedSiteNames, idToken) => {
    const url = `${BACKEND_BASE_URL}/update_sites`;
    const payload = {
        childId: childId,
        siteList: selectedSiteNames,
    };
    try{
        await axiosInstance.post(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
    }catch(error){
        console.error('Failed to save sites for child:', error);
        throw error;
    }
}           

export const getIsRunningApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_is_running/${childId}`;
    try{
        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data;
    }
    catch(error){
        console.error('Failed to get is running:', error);
        throw error;
    }
}

export const blockDeviceApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/block_device/${childId}`;
    try{
        await axiosInstance.post(url, {}, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
    }
    catch(error){
        console.error('Failed to block device:', error);
        throw error;
    }
}

export const unblockDeviceApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/unblock_device/${childId}`;
    try{
        await axiosInstance.post(url, {}, {
            headers: {
                Authorization: `Bearer ${idToken}`, 
            }
        });
    }
    catch(error){
        console.error('Failed to unblock device:', error);
        throw error;
    }
}

export const addNewDeviceApi = async (childId, name, deviceId, devicePassword, idToken) => {
    const url = `${BACKEND_BASE_URL}/add_device`;
    const payload = {
        childId: childId,
        name: name,
        deviceId: deviceId,
        devicePassword: devicePassword,
    };
    try{
        await axiosInstance.post(url, payload, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }
        });
    }
    catch(error){
        console.error('Failed to add device:', error);
        throw error;
    }
}

export const getDevicesApi = async (childId, idToken) => {
    const url = `${BACKEND_BASE_URL}/get_devices/${childId}`;
    try{
        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        return response.data.res;
    }
    catch(error){
        console.error('Failed to get devices:', error);
        throw error;
    }
}

export const deleteDeviceApi = async (childId, deviceId, idToken) => {
    const url = `${BACKEND_BASE_URL}/delete_device/${childId}/${deviceId}`;
    
    try{
        await axiosInstance.delete(url, {
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            }
        });
    }
    catch(error){
        console.error('Failed to delete device:', error);
        throw error;
    }
}

const downloadZipFromPath = async (path, defaultFilename, idToken) => {
    const url = `${BACKEND_BASE_URL}${path}`;
    const response = await axiosInstance.get(url, {
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
        responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const url_blob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url_blob;

    const contentDisposition = response.headers['content-disposition'];
    let filename = defaultFilename;
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
        }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url_blob);
};

export const downloadAgentApi = async (idToken) => {
    try {
        await downloadZipFromPath('/download_agent', 'FamilyBlockService.zip', idToken);
    } catch (error) {
        console.error('Failed to download agent:', error);
        throw error;
    }
};

/** Zip download from UI path (e.g. different platform or variant). */
export const downloadAgentUIApi = async (idToken) => {
    try {
        await downloadZipFromPath('/download_agent_ui', 'FamilyBlockUI.zip', idToken);
    } catch (error) {
        console.error('Failed to download agent (UI):', error);
        throw error;
    }
};

/** Download agent installer. */
export const downloadAgentInstallerApi = async (idToken) => {
    try {
        await downloadZipFromPath('/download_agentInstaller', 'FamilyBlockInstaller.zip', idToken);
    } catch (error) {
        console.error('Failed to download agent installer:', error);
        throw error;
    }
};