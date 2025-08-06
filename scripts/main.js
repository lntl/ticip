let fileSystem = {
    'info.txt': 'Informations système :\n- OS: Terminal Ticip v1.2\n- Utilisateur: Guest\n- Statut: En ligne',
    'cv.txt': 'CURRICULUM VITAE\n================\n\nNom: Développeur Web Full Stack - Pentester\nLangues: Francais | Anglais | Espagnol\nCompétences: JavaScript, HTML, CSS, Php, Python\nExpérience: 10 ans de développement web (Web app/API | FRONT/BACK | Fullstack)\n\nEXPERIENCES\n================\n\nVetolib.fr - Développeur\nTypescript / vuejs 2/3\n(mai 2021 - mars 2025) · 3 ans 11 mois\n================\nAvent Media | groupe Olyn - Développeur\nPHP Symfony / Node / React\nsept. 2020 - avr. 2021 · 8 mois\n================\nMadMix - Développeur\nNode / VueJs\nsept. 2018 - nov. 2019 · 1 an 3 mois\n================\nCocciNet - Développeur\nWordpress / Prestashop / Custom\nsept. 2014 - mars 2017 · 2 ans 7 mois\n================\nSix Feet Over - Web designer\nPhotoshop / Illustrator / HTML|CSS|JS\njuin 2012 - mars 2014 · 1 an 10 mois\n\n\n\n\n',
    'contact.txt': 'Informations de contact :\n\nEmail: lucnat@protonmail.com\nLinkedIn: https://fr.linkedin.com/in/lucas-natale-ab973061?trk=people-guest_people_search-card\nGitHub: https://github.com/lntl\nTryhackme: https://tryhackme.com/p/Ticip'
};

const userFileSystem = JSON.parse(localStorage.getItem('localFileSystem')) || {};
fileSystem = { ...fileSystem, ...userFileSystem };


let currentDirectory = '';
const output = document.getElementById('output');
const input = document.getElementById('command-input');

// Fonction pour ajouter une ligne au terminal
function addLine(content, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;

    if (typeof content === 'string') {
        line.innerHTML = content;
    } else {
        line.appendChild(content); // cas d'un élément DOM (ex: textarea)
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

// Fonction pour obtenir les fichiers du répertoire courant
function getCurrentDirectoryContents() {
    if (currentDirectory === '') {
        return fileSystem;
    }
    
    const pathParts = currentDirectory.split('/').filter(part => part !== '');
    let current = fileSystem;
    
    for (const part of pathParts) {
        if (current[part + '/'] && current[part + '/'].type === 'directory') {
            current = current[part + '/'].contents;
        } else {
            return {};
        }
    }
    
    return current;
}

// Fonction pour convertir les liens en liens cliquables
function makeLinksClickable(text) {
    // Convertir les URLs en liens cliquables (regex améliorée)
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g;
    text = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #00aaff; text-decoration: underline; cursor: pointer;">$1</a>');
    
    // Convertir les emails en liens cliquables
    const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
    text = text.replace(emailRegex, '<a href="mailto:$1" style="color: #00aaff; text-decoration: underline; cursor: pointer;">$1</a>');
    
    return text;
}

// Commande ls
function listFiles() {
    const contents = getCurrentDirectoryContents();
    const items = Object.keys(contents);
    
    if (items.length === 0) {
        addLine('Répertoire vide');
        return;
    }

    let output_text = '';
    items.forEach(item => {
        output_text += `<span class="file">${item}</span><br>`;
    });
    
    addLine(output_text);
}

// Commande cat
function catFile(filename) {
    if (!filename) {
        addLine('Usage: cat [nom_fichier]', 'error');
        return;
    }

    const contents = getCurrentDirectoryContents();
    
    if (contents[filename]) {
        if (typeof contents[filename] === 'string') {
            let fileContent = contents[filename].replace(/\n/g, '<br>');
            fileContent = makeLinksClickable(fileContent);
            addLine(`<div class="file-content">${fileContent}</div>`);
        }
    } else {
        addLine(`cat: ${filename}: Fichier non trouvé`, 'error');
    }
}

// Commande help
function showHelp() {
    addLine(`
        <div class="help-text">
        Commandes disponibles :<br><br>
        <strong>ls</strong> - Lister les fichiers et dossiers du répertoire courant<br>
        <strong>cat [fichier]</strong> - Afficher le contenu d'un fichier<br>
        <strong>help</strong> - Afficher cette aide<br>
        <strong>clear</strong> - Effacer l'écran du terminal<br>
        <strong>touch [fichier]</strong> - Créer un fichier<br>
        <strong>nano [fichier]</strong> - Editer un fichier<br>
        <strong>:(){:|:&};:</strong> - Forkbomb !! Attention utiliser cette commande n'est pas recommandé elle risque de faire planter votre navigateur et meme votre systeme<br><br>

        Fichiers disponibles :<br>
        • cv.txt - Curriculum vitae<br>
        • info.txt - Informations système<br>
        • contact.txt - Informations de contact<br>
        </div>
    `);
}

function clearScreen() {
    output.innerHTML = '';
}

function clearParam(args) {
    let itmExist = itemExist(args);
    let file = args.find(arg => arg.includes('.'));

    let remove_all = args.includes('-rf') && args.includes('*');

    if (remove_all) {
        let content = document.getElementById('content');
        let rem_all = document.getElementById('removeall');
        content.innerHTML = '';
        rem_all.innerHTML = 'Noooon !! Toute ma carrière a disparu ! T’es vraiment un pirate… olala, je vais pleurer 😭';
        setTimeout(() => {
            rem_all.innerHTML = 'Le système va être réinitialisé...';
            
            setTimeout(() => {
                localStorage.removeItem('localFileSystem');
                window.location.reload();
            }, 3000);
        }, 3000);
    }

    if (!itmExist) {
        addLine(`rm: ${file}: Fichier non trouvé`, 'error');
    } else {
        delete fileSystem[itmExist];
        addLine(`rm: ${file}: Fichier supprimé`, 'success');
    }
        
}

function touch(args) {
    let itmExist = itemExist(args);
    let file = args.find(arg => arg.includes('.'));

    if (!itmExist) {
        addLine(`touch: ${file}: Fichier ajouté`, 'success');
        let existing = JSON.parse(localStorage.getItem('localFileSystem')) || {};

        existing[file] = '';

        localStorage.setItem('localFileSystem', JSON.stringify(existing));
        const userFileSystem = JSON.parse(localStorage.getItem('localFileSystem')) || {};
        fileSystem = { ...fileSystem, ...userFileSystem };
    } else {
        addLine(`touch: ${file}: Le fichier existe déjà`, 'error');
    }
}

function itemExist(args) {
    const contents = getCurrentDirectoryContents();
    let file = args.find(arg => arg.includes('.'));
    const items = Object.keys(contents);
    return items.find(item => item == file);
}

function nano(args) {
    let itmExist = itemExist(args);
    let file = args.find(arg => arg.includes('.'));
    if (!itmExist) {
        addLine(`nano: ${file}: Fichier non trouvé`, 'error');
    } else {
        let itmExist = itemExist(args);
        let file = args.find(arg => arg.includes('.'));

        if (!itmExist) {
            addLine(`nano: ${file}: Fichier non trouvé`, 'error');
            return;
        }

        const existing = JSON.parse(localStorage.getItem('localFileSystem')) || {};
        const currentContent = existing[file] || '';

        const container = document.createElement('div');
        container.className = 'nano-editor';

        const textarea = document.createElement('textarea');
        textarea.value = currentContent;
        textarea.rows = 20;
        textarea.cols = 80;
        textarea.style.width = '100%';
        textarea.style.marginTop = '10px';
        textarea.style.fontFamily = 'monospace';
        textarea.style.backgroundColor = '#111';
        textarea.style.color = '#0f0';
        textarea.style.border = '1px solid #444';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Enregistrer';
        saveBtn.style.marginTop = '10px';
        saveBtn.style.display = 'block';

        saveBtn.onclick = () => {
            existing[file] = textarea.value;
            localStorage.setItem('localFileSystem', JSON.stringify(existing));

            const userFileSystem = JSON.parse(localStorage.getItem('localFileSystem')) || {};
            fileSystem = { ...fileSystem, ...userFileSystem };

            addLine(`nano: ${file}: Fichier enregistré`, 'success');
            container.remove();
        };

        container.appendChild(textarea);
        container.appendChild(saveBtn);
        addLine(container);
    }
}

function processCommand(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    addLine(`<span class="prompt">Guest@terminal:~${currentDirectory}$</span> <span class="command">${command}</span>`);

    switch (cmd) {
        case 'ls':
            listFiles();
            break;
        case 'cat':
            catFile(args[0]);
            break;
        case 'help':
            showHelp();
            break;
        case 'clear':
            clearScreen();
            break;
        case 'rm':
            clearParam(args);
            break;
        case 'touch':
            touch(args);
            break;
        case 'nano':
            nano(args);
            break;
        case ':(){:|:&};:':
            while (true) {
                addLine(`Boom is comming SER.....`, 'error')
                window.open('https://pwned.com/')
            }
        case '':
            break;
        default:
            addLine(`Commande non reconnue: ${cmd}. Tapez 'help' pour voir les commandes disponibles.`, 'error');
    }
}


input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = input.value;
        processCommand(command);
        input.value = '';
    }
});

// Garder le focus sur l'input
// document.addEventListener('click', function() {
//     input.focus();
// });

setTimeout(() => {
    addLine('<span class="help-text">Tapez "help" pour voir les commandes disponibles ou "ls" pour commencer !</span>');
}, 1000);


// GET IP ADDRESS
fetch('https://httpbin.org/ip')
  .then(response => response.json())
  .then((data) => {
    let ip = document.getElementById('yourip');
    ip.innerText = data.origin
  });

fetch('https://httpbin.org/user-agent')
  .then(response => response.json())
  .then((data) => {
    const regex = /\(([^)]+)\).*?(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/;
    const match = data['user-agent'].match(regex);
    if (match) {
        const divnavigator = document.getElementById('navigator')
        const divos = document.getElementById('os')
        const os = match[1];
        const browser = match[2];
        const version = match[3];
        divnavigator.innerText = browser;
        divos.innerText = os;
    }
  });
  