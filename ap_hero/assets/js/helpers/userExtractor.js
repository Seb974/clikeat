export default function(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const data = JSON.parse(window.atob(base64));
    return data.data;
}