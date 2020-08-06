const org = 'axtran';
const repo = 'private-gridster';
const branch = 'gh-pages-private';
const page = '_site/index.html';
document.writeln('init ok:'+org+'/'+repo+'/'+page+'?ref='+branch+'**');

function onSubmit(form) {
  document.writeln("onsubmit start!\n");
  // step 1
  const login = form.username || form.querySelector('#login').value;
  const password = form.token || form.querySelector('#password').value;
  
  //document.writeln('submit started:/repos/'+org+'/'+repo+'/contents/'+page+'*step 1*');
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

  document.writeln('request:'+request+'*2*');
  fetch(request)
    .then(function (response) {
      //document.writeln('status:'+response.status+'*3*');
      if (response.status !== 200) {                   // step 4 200
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