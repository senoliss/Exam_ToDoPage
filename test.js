const token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTUxMiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibWFyaXV4YXMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzA3ODE2MzEwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MDQxIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzA0MSJ9.C1uyPQJQeGIotHkduj2dBViPC4eHqiZUI1c8yMwun1XrLVgR9KFKgDg_-QhshnfgTQ2CBJBOcw6UGN38k-Gu6w";

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const decodedToken = parseJwt(token);

console.log(decodedToken);

const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

console.log('Name:', name);
console.log('Role:', role);
