const pkg = require('./package.json');
const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const port = 8080; // eslint-disable-line

// Load interviews
let nomes = fs.readdirSync('src/projetos');
let projetos = [];
for(const nome of nomes) {
    if(nome.split('.')[1] == 'json')
        projetos.push({name: nome.replace('.json', ''), content: require('./src/projetos/'+nome)});
}

function GetProjeto(projeto) {
    for(let e of projetos) {
        if(e.name === projeto)
            return e.content;
    }

    return false;
}

app.use(express.static(`${__dirname}/src`));
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    return res.render('home', { projetos });
});

app.get('/projeto/:projeto', (req, res) => {
    let projeto = GetProjeto(req.params.projeto);
    if(projeto === false)
        return res.status(400).json({message: '400 Bad Request'});
    else
        return res.render('projeto', { data: projeto, projetos });
});

app.get('/github', (req, res) => {
    return res.redirect(pkg.homepage)
})

app.use((req, res) => {
    return res.status(404).json({message: '404 Not Found', coolthing: 'opa opa campeao'});
});

http.listen(port, () => {
    console.log(`ok ${port}`);
});
