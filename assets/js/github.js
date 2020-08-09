const org = 'axtran';
const repo = 'private-gridster';
const branch = 'gh-pages-private';
const base = '_site';
const path =  window.location.pathname ;
const file = 'index.html';
const page = `${base}${path}${file}`;
document.writeln("pathname: "+page);
function onSubmit(form) {
  
  // step 1
  const login = form.username || form.querySelector('#login').value;
  const password = form.token || form.querySelector('#password').value;
  //const page = window.location.pathname;
  
  //const token = btoa(`${login}:${password}`);
  
  //#`https://api.github.com/repos/${org}/${repo}/contents/${page}?ref=${branch}`,
  
  // step 2
  //# Authorization: `token ${token}`
  
  const request = new Request(
    
    `https://api.github.com/repos/${org}/${repo}/contents/${page}`,
    {
      method: 'GET',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        Authorization: `token ${password}`
      },
    });

  
  fetch(request)
    .then(function (response) {
  
      if (response.status !== 200) {                   // step 4 200
        //document.writeln("github request failed! ***");
        document.querySelector('#loginForm').innerHTML = `Failed to load document (status: ${response.status})`;
      } else {
        response.json()
          .then(function (json) {                       // step 5
            const content = json.encoding === 'base64' ? atob(json.content) : json.content;
            const startIdx = content.indexOf('<body');  // step 6
            document.body.innerHTML = content.substring(
                content.indexOf('>', startIdx) + 1,
                content.indexOf('</body>'));
            localStorage.setItem('githubPagesAuth', JSON.stringify({username: login, token: password }));
          });
      }
    });

    return false;
}

const existingAuth = JSON.parse(localStorage.getItem('githubPagesAuth'));
if (existingAuth) {
    onSubmit(existingAuth);
} // trigger a fake authentication if credentials are already present in the localStorage