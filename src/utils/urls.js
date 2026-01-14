export const API_URL = import.meta.env.VITE_BACKEND_URL

export const getAuthorized = (additionalHeaders = {}) => {
    const user = sessionStorage.getItem('metadataUser') || '{}'

    return ({
        headers: { 
            Authorization: `Bearer ${sessionStorage.getItem('token')}`, 
            'X-Metadata': user,
            ...additionalHeaders 
        },
    })
}