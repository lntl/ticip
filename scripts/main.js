const fileSystem = {
    'info.txt': 'Informations système :\n- OS: Terminal Ticip v1.0\n- Utilisateur: Guest\n- Statut: En ligne',
    'cv.txt': 'CURRICULUM VITAE\n================\nNom: Développeur Web - Pentester \nCompétences: JavaScript, HTML, CSS, Php, Python\nExpérience: 10 ans de développement',
    'contact.txt': 'Informations de contact :\n\nEmail: luc.natale@gmail.com\nLinkedIn: https://fr.linkedin.com/in/lucas-natale-ab973061?trk=people-guest_people_search-card\nGitHub: https://github.com/lntl'
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
        if (item.endsWith('/')) {
            output_text += `<span class="directory">${item}</span>  `;
        } else {
            output_text += `<span class="file">${item}</span>  `;
        }
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
            const fileContent = contents[filename].replace(/\n/g, '<br>');
            addLine(`<div class="file-content">${fileContent}</div>`);
        } else {
            addLine(`cat: ${filename}: Est un répertoire`, 'error');
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
            // Ne rien faire pour une ligne vide
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