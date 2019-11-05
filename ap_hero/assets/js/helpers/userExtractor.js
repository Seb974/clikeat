export default function(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const data = JSON.parse(window.atob(base64));
    if ( data.data.metadata.length > 0 ) {
        data.data.metadata = JSON.parse(data.data.metadata);
    }
    return data.data;
}