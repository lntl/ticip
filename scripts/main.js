const fileSystem = {
    'info.txt': 'Informations système :\n- OS: Terminal Ticip v1.0\n- Utilisateur: Guest\n- Statut: En ligne',
    'cv.txt': 'CURRICULUM VITAE\n================\n\nNom: Développeur Web Full Stack - Pentester\nLangues: Francais | Anglais | Espagnol\nCompétences: JavaScript, HTML, CSS, Php, Python\nExpérience: 10 ans de développement web (Web app/API | FRONT/BACK | Fullstack)\n\nEXPERIENCES\n================\n\nVetolib.fr - Développeur\nTypescript / vuejs 2/3\n(mai 2021 - mars 2025) · 3 ans 11 mois\n================\nAvent Media | groupe Olyn - Développeur\nPHP Symfony / Node / React\nsept. 2020 - avr. 2021 · 8 mois\n================\nMadMix - Développeur\nNode / VueJs\nsept. 2018 - nov. 2019 · 1 an 3 mois\n================\nCocciNet - Développeur\nWordpress / Prestashop / Custom\nsept. 2014 - mars 2017 · 2 ans 7 mois\n================\nSix Feet Over - Web designer\nPhotoshop / Illustrator / HTML|CSS|JS\njuin 2012 - mars 2014 · 1 an 10 mois\n\n\n\n\n',
    'contact.txt': 'Informations de contact :\n\nEmail: luc.natale@gmail.com\nLinkedIn: https://fr.linkedin.com/in/lucas-natale-ab973061?trk=people-guest_people_search-card\nGitHub: https://github.com/lntl\nTryhackme: https://tryhackme.com/p/Ticip'
};



let currentDirectory = '';
const output = document.getElementById('output');
const input = document.getElementById('command-input');

// Fonction pour ajouter une ligne au terminal
function addLine(content, className = '') {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = content;
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
        <strong>clear</strong> - Effacer l'écran du terminal<br><br>
        
        Fichiers disponibles :<br>
        • cv.txt - Curriculum vitae<br>
        • info.txt - Informations système<br>
        • contact.txt - Informations de contact<br>
        </div>
    `);
}

// Commande clear
function clearScreen() {
    output.innerHTML = '';
}

// Traitement des commandes
function processCommand(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Afficher la commande tapée
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
        case '':
            break;
        default:
            addLine(`Commande non reconnue: ${cmd}. Tapez 'help' pour voir les commandes disponibles.`, 'error');
    }
}

// Gestion des événements clavier
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const command = input.value;
        processCommand(command);
        input.value = '';
    }
});

// Garder le focus sur l'input
document.addEventListener('click', function() {
    input.focus();
});

// Message de démarrage
setTimeout(() => {
    addLine('<span class="help-text">Tapez "help" pour voir les commandes disponibles ou "ls" pour commencer !</span>');
}, 1000);