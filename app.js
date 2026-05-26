const ADMIN_MAIL = "nastasia.kecili@kaeser.com";

const gamme = [
  { 
      name: "Compresseurs à vis", 
      image: "./img/compresseurs.png",
      sub: [
          { name: "SC2 (Vis)", files: [] },
          { name: "SC3 (Vis)", files: [] }
      ]
  },
  { name: "Vis sèche", image: "./img/vis seche.png", files: [] },
  { name: "Surpresseur à vis", image: "./img/surpresseurs.png", files: [] },
  { name: "Mobilair", image: "./img/mobilair.png", files: [] },
  { name: "Piston", image: "./img/piston.png", files: [] },
  { 
      name: "Traitement d'air", 
      image: "./img/traitement-air.png", 
      sub: [
          { name: "Sécheur frigorifique", image: "./img/secheur frig.png", files: [] },
          { name: "Sécheur adsorption", image: "./img/secheur dc.png", files: [] },
          { name: "Sécheur à membrane", image: "./img/membrane.png", files: [] },
          { name: "Filtration", image: "./img/filtration.png", files: [] },
          { name: "Vanne DHS", image: "./img/vanne dhs.png", files: [] },
          { name: "AQUAMAT", image: "./img/condensats.png", files: [] },
          { name: "Purgeur", image: "./img/purgeur.png", files: [] } 
      ]
  },
  { 
      name: "Sigma Control",
      image: "./img/sc2-panel.png.png", 
      sub: [
          { name: "SCB", image: "./img/scb-machine.jpg", files: [] }, 
          { name: "SC1", image: "./img/sc1-machine.jpg", files: [] },
          { name: "SC2", image: "./img/sc2-machine.jpg", isSC2Menu: true },
          { name: "SC3", image: "./img/sc3-machine.jpg", files: [] }
      ]
  },
  { name: "SAM 4.0", image: "./img/sam.png", files: [] },
  { name: "Variateur", image: "./img/variateur.png", files: [] },
  { name: "Instruments", image: "./img/instruments.png", files: [] },
  { name: "Huile", image: "./img/huile.png", files: [] },
  { name: "ADA", desc: "Sécheurs par adsorption", image: "./img/ada.png", files: ["ADA.pdf"] },
  { name: "BELIMO", image: "./img/belimo.png", files: [] }
];

let scrollPos = 0;
let currentUser = "";
let currentGarantieType = "";

// --- NAVIGATION HUB ---
function showHub() {
    document.getElementById('main-hub').style.display = 'grid';
    document.getElementById('support-section').style.display = 'none';
    document.getElementById('help-btn-section').style.display = 'none';
    updateBackButton(null);

    const adminBtn = document.getElementById('admin-nav-btn');
    const userBtn = document.getElementById('user-requests-btn');
    
    if (currentUser === ADMIN_MAIL) {
        if(adminBtn) adminBtn.style.display = 'inline-block';
        if(userBtn) userBtn.style.display = 'none';
    } else if (currentUser !== "") {
        if(adminBtn) adminBtn.style.display = 'none';
        if(userBtn) userBtn.style.display = 'inline-block';
    }
}

function showSupportHome() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('search-wrapper').style.display = 'block';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "grille-produits";
    mgr.innerHTML = gamme.map(p => `
        <div class="card-produit" onclick="handleSelect('${p.name.replace(/'/g, "\\'")}')">
            ${p.image ? `<img src="${p.image}">` : `<div class="card-icon-wrapper">⚙️</div>`}
            <h3>${p.name}</h3>
        </div>`).join('');
}

// --- AUTHENTIFICATION ---
function handleLogin() {
    const email = document.getElementById('email').value.toLowerCase().trim();
    const pass = document.getElementById('pass').value;
    const stored = localStorage.getItem('kaeser_user_' + email);
    if(stored === pass) {
        currentUser = email;
        document.getElementById('page-login').style.display = 'none';
        document.getElementById('page-app').style.display = 'block';
        showHub();
    } else { alert("Erreur d'identifiants"); }
}

function handleRegister() {
    const email = document.getElementById('reg-email').value.toLowerCase().trim();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;
    
    if(!email || !pass) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    if(pass !== passConfirm) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }
    
    localStorage.setItem('kaeser_user_' + email, pass);
    alert("Compte créé !");
    toggleAuth(false);
}

// CORRIGÉ : Nettoyage et forçage de l'affichage pour éviter les conflits d'inscription
function toggleAuth(isReg) {
    if (isReg) {
        document.getElementById('login-form-div').style.display = 'none';
        document.getElementById('register-form-div').style.display = 'block';
    } else {
        document.getElementById('login-form-div').style.display = 'block';
        document.getElementById('register-form-div').style.display = 'none';
    }
}

// FONCTION UTILITAIRE POUR GERER LES CHAMPS MACHINE
function toggleMachineFields(show) {
    const display = show ? 'block' : 'none';
    document.getElementById('req-machine').style.display = display;
    document.getElementById('req-machine').required = show;
    document.getElementById('req-serie').style.display = display;
    document.getElementById('req-serie').required = show;
    document.getElementById('req-ref').style.display = display;
    document.getElementById('req-ref').required = show;
}

// --- GARANTIE ---
function showGarantieMenu() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('search-wrapper').style.display = 'none';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    mgr.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;"><h2 style="color:#001e3e; font-weight:800; font-size: 28px;">Service Garantie</h2></div>
        <div class="choice-row" onclick="openFormGarantie('enregistrement')">Enregistrement de la machine ➜</div>
        <div class="choice-row" onclick="openFormGarantie('demande')">Demande de Garantie ➜</div>
    `;
}

function openFormGarantie(type) {
    currentGarantieType = type;
    document.getElementById('request-modal').style.display = 'flex';
    document.getElementById('req-service').value = "Garantie";
    document.getElementById('req-service').disabled = true;
    toggleMachineFields(true);

    const clientFinalDiv = document.getElementById('client-final-group');
    const adressePostaleDiv = document.getElementById('adresse-postale-group');

    if(clientFinalDiv) clientFinalDiv.style.display = 'block';
    if(adressePostaleDiv) adressePostaleDiv.style.display = 'block';

    if(type === 'enregistrement') {
        document.getElementById('modal-title').innerText = "Enregistrement Machine";
        if(document.getElementById('label-pj1')) document.getElementById('label-pj1').innerText = "fiche mise en route";
        if(document.getElementById('label-pj2')) document.getElementById('label-pj2').innerText = "PHOTOS D'INSTALLATION";
        
        if(document.getElementById('file-section-1')) document.getElementById('file-section-1').style.display = 'block';
        if(document.getElementById('file-section-2')) document.getElementById('file-section-2').style.display = 'block';
        if(document.getElementById('file-section-3')) document.getElementById('file-section-3').style.display = 'none'; 
    } else {
        document.getElementById('modal-title').innerText = "Demande de Garantie";
        if(document.getElementById('file-section-1')) document.getElementById('file-section-1').style.display = 'none';
        
        if(document.getElementById('file-section-2')) document.getElementById('file-section-2').style.display = 'block';
        if(document.getElementById('label-pj2')) document.getElementById('label-pj2').innerText = "PHOTOS D'INSTALLATION";
        
        if(document.getElementById('file-section-3')) document.getElementById('file-section-3').style.display = 'block'; 
        if(document.getElementById('label-pj3')) document.getElementById('label-pj3').innerText = "DATA BACKUP (Sauvegarde)";
    }
}

// --- MENU PIÈCES DÉTACHÉES ---
function showPiecesMenu() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('search-wrapper').style.display = 'none';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    mgr.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;"><h2 style="color:#001e3e; font-weight:800; font-size: 28px;">Pièces Détachées</h2></div>
        <div class="choice-row" onclick="openFormPieces()">Demande d'informations/Prix ➜</div>
    `;
}

function openFormPieces() {
    currentGarantieType = "pieces"; 
    document.getElementById('request-modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = "Demande d'informations / Prix";
    document.getElementById('req-service').value = "Pièces Détachées";
    document.getElementById('req-service').disabled = true;
    toggleMachineFields(true);

    const clientFinalDiv = document.getElementById('client-final-group');
    const adressePostaleDiv = document.getElementById('adresse-postale-group');
    if(clientFinalDiv) clientFinalDiv.style.display = 'none';
    if(adressePostaleDiv) adressePostaleDiv.style.display = 'none';

    if(document.getElementById('label-pj1')) document.getElementById('label-pj1').innerText = "pieces jointes";
    if(document.getElementById('file-section-1')) document.getElementById('file-section-1').style.display = 'block';
    if(document.getElementById('file-section-2')) document.getElementById('file-section-2').style.display = 'none';
    if(document.getElementById('file-section-3')) document.getElementById('file-section-3').style.display = 'none';
}

// --- MENU FORMATION ---
function showFormationMenu() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('search-wrapper').style.display = 'none';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    mgr.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;"><h2 style="color:#001e3e; font-weight:800; font-size: 28px;">Formation</h2></div>
        <div class="choice-row" onclick="openFormFormation()">Demande d'informations/Prix ➜</div>
    `;
}

function openFormFormation() {
    currentGarantieType = "formation"; 
    document.getElementById('request-modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = "Demande d'informations / Prix";
    document.getElementById('req-service').value = "Formation";
    document.getElementById('req-service').disabled = true;

    toggleMachineFields(false);

    const clientFinalDiv = document.getElementById('client-final-group');
    const adressePostaleDiv = document.getElementById('adresse-postale-group');
    if(clientFinalDiv) clientFinalDiv.style.display = 'none';
    if(adressePostaleDiv) adressePostaleDiv.style.display = 'none';

    if(document.getElementById('file-section-1')) document.getElementById('file-section-1').style.display = 'none';
    if(document.getElementById('file-section-2')) document.getElementById('file-section-2').style.display = 'none';
    if(document.getElementById('file-section-3')) document.getElementById('file-section-3').style.display = 'none';
}

// --- LOGIQUE DEMANDES ---
function openRequestModal() { 
    currentGarantieType = "";
    document.getElementById('request-modal').style.display = 'flex';
    document.getElementById('modal-title').innerText = "Nouvelle Demande d'Expertise";
    document.getElementById('req-service').value = "Support Technique";
    document.getElementById('req-service').disabled = false;
    toggleMachineFields(true);
    if(document.getElementById('label-pj1')) document.getElementById('label-pj1').innerText = "PIÈCE JOINTE (Optionnel)";
    
    const clientFinalDiv = document.getElementById('client-final-group');
    const adressePostaleDiv = document.getElementById('adresse-postale-group');
    if(clientFinalDiv) clientFinalDiv.style.display = 'none';
    if(adressePostaleDiv) adressePostaleDiv.style.display = 'none';

    if(document.getElementById('file-section-1')) document.getElementById('file-section-1').style.display = 'block';
    if(document.getElementById('file-section-2')) document.getElementById('file-section-2').style.display = 'none';
    if(document.getElementById('file-section-3')) document.getElementById('file-section-3').style.display = 'none';
}

function closeRequestModal() { document.getElementById('request-modal').style.display = 'none'; }

function handleSendRequest(e) {
    e.preventDefault();
    const file1 = document.getElementById('req-file').files[0];
    const file2 = document.getElementById('req-file-2').files[0];
    const file3 = document.getElementById('req-file-3').files[0];

    const finaliserEnvoi = (pj1 = "", pj2 = "", pj3 = "") => {
        const nom = document.getElementById('req-nom').value.toUpperCase();
        const prenom = document.getElementById('req-prenom').value;
        const machine = document.getElementById('req-machine').value;
        const ref = document.getElementById('req-ref').value;
        const serie = document.getElementById('req-serie').value;
        const messageClient = document.getElementById('req-msg').value;
        
        const clientFinalEl = document.getElementById('req-client-final');
        const adressePostaleEl = document.getElementById('req-adresse-postale');
        const clientFinal = clientFinalEl ? clientFinalEl.value : "";
        const adressePostale = adressePostaleEl ? adressePostaleEl.value : "";

        let serviceTxt = document.getElementById('req-service').value;
        let prefixe = "";
        if(currentGarantieType && currentGarantieType === "enregistrement") { prefixe = "[ENREGISTREMENT] "; serviceTxt = "Garantie"; }
        else if(currentGarantieType === "demande") { prefixe = "[DEMANDE GARANTIE] "; serviceTxt = "Garantie"; }
        else if(currentGarantieType === "pieces") { prefixe = "[PIÈCES] "; serviceTxt = "Pièces Détachées"; }
        else if(currentGarantieType === "formation") { prefixe = "[FORMATION] "; serviceTxt = "Formation"; }

        const req = {
            id: Date.now(),
            sender: currentUser,
            nom: nom + " " + prenom,
            clientFinal: clientFinal,
            adressePostale: adressePostale,
            machine, serie, ref, message: messageClient,
            date: new Date().toLocaleString(),
            reponse: "",
            service: serviceTxt,
            pj1: pj1, pj2: pj2, pj3: pj3
        };
        let all = JSON.parse(localStorage.getItem('kaeser_requests') || "[]");
        all.push(req);
        localStorage.setItem('kaeser_requests', JSON.stringify(all));

        const baseURL = "https://docs.google.com/forms/d/e/1FAIpQLScmDQuBqsagwg1SL7t_RvdKFZEUHht6t9jP_V1gXHKpIOyiYg/viewform?usp=pp_url";
        let extraInfo = "";
        if (clientFinal) extraInfo += `[CLIENT FINAL: ${clientFinal}] `;
        if (adressePostale) extraInfo += `[ADRESSE: ${adressePostale}] `;

        const prefilledURL = baseURL + 
            "&entry.1365711207=" + encodeURIComponent(nom + " " + prenom) +
            "&entry.592683861=" + encodeURIComponent(machine) +
            "&entry.902720963=" + encodeURIComponent(ref) +
            "&entry.1369530804=" + encodeURIComponent(serie) +
            "&entry.288880941=" + encodeURIComponent(extraInfo + prefixe + messageClient);

        alert("Demande enregistrée.");
        window.open(prefilledURL, '_blank');
        document.getElementById('expert-form').reset();
        closeRequestModal();
    };

    let d1 = "", d2 = "", d3 = "";
    let readersCount = 0;
    let totalToRead = (file1 ? 1 : 0) + (file2 ? 1 : 0) + (file3 ? 1 : 0);
    if (totalToRead === 0) { finaliserEnvoi(); return; }
    const checkDone = () => { if(++readersCount === totalToRead) finaliserEnvoi(d1, d2, d3); };
    if (file1) { let r1 = new FileReader(); r1.onload = (e) => { d1 = e.target.result; checkDone(); }; r1.readAsDataURL(file1); }
    if (file2) { let r2 = new FileReader(); r2.onload = (e) => { d2 = e.target.result; checkDone(); }; r2.readAsDataURL(file2); }
    if (file3) { let r3 = new FileReader(); r3.onload = (e) => { d3 = e.target.result; checkDone(); }; r3.readAsDataURL(file3); }
}

// --- PANEL ADMIN ---
function showAdminPanel() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('help-btn-section').style.display = 'none';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    let all = JSON.parse(localStorage.getItem('kaeser_requests') || "[]");
    let html = `<h2>ADMINISTRATION - RÉPONSES</h2>`;
    all.slice().reverse().forEach(r => {
        const btn1 = r.pj1 ? `<button onclick="ouvrirPJDirect('${r.pj1}')" style="background:#28a745; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; margin-top:10px;">👁️ Fiche/PJ</button>` : "";
        const btn2 = r.pj2 ? `<button onclick="ouvrirPJDirect('${r.pj2}')" style="background:#007bff; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; margin-top:10px; margin-left:5px;">👁️ Photo</button>` : "";
        const btn3 = r.pj3 ? `<button onclick="ouvrirPJDirect('${r.pj3}')" style="background:#7f8c8d; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; margin-top:10px; margin-left:5px;">👁️ Backup</button>` : "";
        let clientInfo = r.clientFinal ? `<p><b>Client Final:</b> ${r.clientFinal}</p>` : "";
        if (r.adressePostale) clientInfo += `<p><b>Adresse Postale:</b> ${r.adressePostale}</p>`;
        html += `<div class="admin-card" style="background:white; padding:15px; border-radius:8px; margin-bottom:15px; border:1px solid #ddd;">
            <b>DE: ${r.nom} [${r.service || 'Expertise'}] (${r.date})</b><br>
            ${clientInfo}
            <p><b>Machine:</b> ${r.machine}</p>
            <p><b>Message:</b> ${r.message}</p>
            ${btn1} ${btn2} ${btn3}
            <textarea id="reply-to-${r.id}" class="reply-area" style="width:100%; height:60px; margin-top:10px;">${r.reponse || ""}</textarea><br>
            <button onclick="saveReply(${r.id})" class="btn-send-reply" style="background:#001e3e; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; margin-top:5px;">RÉPONDRE</button>
        </div>`;
    });
    mgr.innerHTML = html || "<p>Aucune demande.</p>";
}

function saveReply(id) {
    let all = JSON.parse(localStorage.getItem('kaeser_requests') || "[]");
    const replyText = document.getElementById(`reply-to-${id}`).value;
    const index = all.findIndex(r => r.id === id);
    if(index !== -1) {
        all[index].reponse = replyText;
        localStorage.setItem('kaeser_requests', JSON.stringify(all));
        alert("Réponse enregistrée !");
    }
}

function ouvrirPJDirect(base64) {
    const win = window.open();
    if (win) {
        win.document.write(`<html><head><title>Visualisation Pièce Jointe</title><style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #1a1a1a; } iframe { border: none; width: 100%; height: 100%; }</style></head><body><iframe src="${base64}" allowfullscreen></iframe></body></html>`);
        win.document.close();
    } else { alert("Veuillez autoriser les fenêtres pop-up."); }
}

function showUserRequests() {
    document.getElementById('main-hub').style.display = 'none';
    document.getElementById('support-section').style.display = 'block';
    document.getElementById('help-btn-section').style.display = 'none';
    updateBackButton("showHub()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    let all = JSON.parse(localStorage.getItem('kaeser_requests') || "[]");
    let mine = all.filter(r => r.sender === currentUser);
    let html = `<h2>Mes Demandes</h2>`;
    mine.forEach(r => {
        html += `<div class="file-row" style="flex-direction:column; align-items:flex-start;">
            <b>Demande du ${r.date} (Service: ${r.service || 'Expertise'})</b>
            <p><i>Mon message : ${r.message}</i></p>
            <div style="margin-top:10px; padding:10px; background:#fff9e6; border-radius:5px; width:100%;">
                <b>Réponse Kaeser :</b><br>
                ${r.reponse ? `<span>${r.reponse}</span>` : `<span style="color:red;">En cours de traitement...</span>`}
            </div>
        </div>`;
    });
    mgr.innerHTML = html || "<p>Aucun historique.</p>";
}

function openSecurePdf(fileName) {
    const fileURL = encodeURI(`pdfs/${fileName}`);
    const modal = document.getElementById('pdf-modal');
    const container = document.getElementById('pdf-container');
    scrollPos = 0; 
    container.innerHTML = `<div style="position:relative; width:85%; height:90vh; background:#1a1a1a; border-radius:12px; overflow:hidden; display:flex;"><div style="width:110px; background:#111; display:flex; flex-direction:column; gap:25px; padding:15px; justify-content:center; align-items:center; border-right:2px solid #ffcc00; z-index:10010;"><button onclick="scrollManual(0, true)" style="background:#fff; border:none; width:55px; height:55px; font-size:10px; cursor:pointer; border-radius:8px; font-weight:bold;">DEBUT</button><button onclick="scrollManual(-600)" style="background:#ffcc00; border:none; width:65px; height:65px; font-size:30px; cursor:pointer; border-radius:50%; font-weight:bold;">▲</button><button onclick="scrollManual(600)" style="background:#ffcc00; border:none; width:65px; height:65px; font-size:30px; cursor:pointer; border-radius:50%; font-weight:bold;">▼</button></div><div style="flex:1; position:relative; overflow:hidden; background:white;"><div style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:9999; background:transparent;"></div><div id="pdf-mover" style="position:absolute; top:0; left:0; width:100%; height:100%; transition: transform 0.3s ease-out;"><iframe src="${fileURL}#toolbar=0" width="100%" height="30000px" style="border:none;"></iframe></div></div></div>`;
    container.oncontextmenu = function() { return false; };
    modal.style.display = 'block';
}

function scrollManual(amount, reset = false) {
    const mover = document.getElementById('pdf-mover');
    if(reset) scrollPos = 0; else scrollPos += amount;
    if(scrollPos < 0) scrollPos = 0;
    mover.style.transform = `translateY(-${scrollPos}px)`;
}

function closePdf() { document.getElementById('pdf-modal').style.display = 'none'; document.getElementById('pdf-container').innerHTML = ''; }
function updateBackButton(cb) { document.getElementById('back-button-container').innerHTML = cb ? `<button class="btn-back" onclick="${cb}">← Retour</button>` : ""; }
function handleSelect(name) {
    const item = findDeepItem(name);
    if (item.sub) showSub(item); 
    else showFiles(item.name, item.files);
}
function findDeepItem(name) { 
    let res = gamme.find(i => i.name === name); 
    if(res) return res; 
    gamme.forEach(p => { if(p.sub) { let s = p.sub.find(sub => sub.name === name); if(s) res = s; } }); 
    return res; 
}
function showSub(parent) {
    document.getElementById('help-btn-section').style.display = 'none';
    updateBackButton("showSupportHome()");
    const mgr = document.getElementById('view-manager');
    mgr.className = "grille-produits";
    document.getElementById('search-wrapper').style.display = "none";
    mgr.innerHTML = parent.sub.map(s => {
        const action = s.isSC2Menu ? `showSC2Menu()` : `showFiles('${s.name}', ${JSON.stringify(s.files || [])})`;
        return `<div class="card-produit" onclick="${action}">${s.image ? `<img src="${s.image}">` : `<div class="card-icon-wrapper">⚙️</div>`}<h3>${s.name}</h3></div>`;
    }).join('');
}
function showSC2Menu() {
    if(currentUser !== ADMIN_MAIL) document.getElementById('help-btn-section').style.display = 'block'; 
    updateBackButton("handleSelect('Sigma Control')");
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    mgr.innerHTML = `<div style="text-align: center; margin-bottom: 30px;"><h2 style="color:#001e3e; font-weight:800; font-size: 28px;">Sigma Control 2</h2></div><div class="choice-row" onclick="showFiles('Notices d’utilisation', ['Notice_SC2_901897_22_Piston.pdf', 'Notice_SC2_9_9450_21F_Fluid.pdf', 'Notice_SC2_901700_09F_Blower.pdf', 'Notice_SC2_901700_20F_Omega.pdf', 'Notice SC2 BOOSTER.pdf', 'Notice SC2 MCSIO_Fluid.pdf'], 'SC2')">Notices d'utilisation ➜</div><div class="choice-row" onclick="showFiles('Mise à jour', ['dry_5.1.1.tgz', 'fluid_6.5.4.tgz', 'piston_3.4.2.zip', 'dry-2_1.1.4.tgz', 'dry-2_1.1.5.tgz', 'dry-2_1.1.7.tgz', 'dry-2_1.1.8.tgz', 'dry-2_1.2.1.tgz', 'fluid_2.0.1.zip', 'fluid_3_0_0.zip', 'fluid_4.0.1.tgz', 'fluid_6.3.3.tgz', 'fluid_6.4.1.tgz', 'fluid_6.4.2.tgz', 'fluid_6.5.1.tgz', 'fluid_6.5.3.tgz', 'vac_6.3.2.tgz', 'vac_6.4.1.tgz', 'vac_6.5.4.tgz', 'piston_3.3.0.tgz', 'piston_3.4.1.zip'], 'SC2')">Mise à jour ➜</div><div class="choice-row" onclick="toggleAcc('com-menu')">Interface COM / Process Map ▼</div><div id="com-menu" style="display:none; padding-left:20px; border-left: 2px solid #ffcc00; margin-bottom:10px;"><div class="choice-row" onclick="showFiles('Interface COM DeviceNet', ['DeviceNet EDS File.zip', 'Devicenet_7_5250_01910_03F.pdf'], 'SC2')">Interface COM DeviceNet ➜</div><div class="choice-row" onclick="showFiles('Interface COM Profibus', ['Profibus_7_5250_01880_06F.pdf', 'KAES0CEC.GSD'], 'SC2')">Interface COM Profibus ➜</div><div class="choice-row" onclick="showFiles('Interface COM Profinet', ['Profinet_7_5250_01920_08F.pdf', 'GSDML-V2.25-Kaeser-SC2-20120203.xml'], 'SC2')">Interface COM Profinet ➜</div><div class="choice-row" onclick="showFiles('Interface COM Modbus RTU', ['Modbus_RTU_7_5250_01900_06F.pdf'], 'SC2')">Interface COM Modbus RTU ➜</div><div class="choice-row" onclick="showFiles('Interface COM Modbus TCP', ['Modbus_TCP_7_5250_01950_08F.pdf'], 'SC2')">Interface COM Modbus TCP ➜</div><div class="choice-row" onclick="showFiles('Interface COM Ethernet', ['7_5250_02090_01F.pdf', 'SC2 - EtherNet IP EDS File.zip'], 'SC2')">Interface COM Ethernet ➜</div><div class="choice-row" onclick="showFiles('Process Map', ['7_7601_BLOW_PA_14E.pdf', '7_7601_BOOSTER_PA_03E.pdf', '7_7601_DRY_PA_06E.pdf', '7_7601_FLUID_PA_26E.pdf', '7_7601_FLUID_VAC_22E.pdf', '7_7601_PISTON_PA_02E.pdf'], 'SC2')">Process Map ➜</div></div><div class="choice-row" onclick="showFiles('Codes défauts', ['Fluide_0410.pdf', 'Fluide 0001 A Sens de rotation.pdf', '0008 Température finale de compression TFC.pdf', '0013 Surintensité moteur compresseur.pdf', '0019 Défaut pression interne PI.pdf', '0245 (S) Moteur de compresseur FU.pdf', 'Fluide 0001 Hardware watchdog reset.pdf', 'Fluide_0410.pdf', 'Fluide 0002 Internal Software Error.pdf', '0008 et 0024 Message de diagnostic collectif.pdf', '0010 Protection décharge.pdf', '0011 Surintensité du ventilateur principal.pdf', '0012 Portes d_accès.pdf', '0015 A Défaut BUSS.pdf', '0017 Arrêt automatique TFC Power.pdf', '0018 SC2 MCS T haute.pdf', '0021 Défaut sécheur frigorifique.pdf', '0027 Power Off On .pdf', '0034 Le contacteur colle.pdf', '0038 (W) Protection décharge.pdf', '0040 Le contacteur de ligne ne colle pas.pdf', '0041 Tension secteur.pdf', '0042 Contre-pression arrêt.pdf', '0043 Température final de compression dT - dt.pdf', '0044 Pas de montée en pression.pdf', '0047 Pas de montée en pression.pdf', '0056 RD défaut sur Eco Drain.pdf', '0058 SC2 Erreur de communication SC2.pdf', '0059 Contre-pression marche.pdf', '0061 Compresseur T ↓.pdf', '0062 Défaut pression gaz sur Sécheur P.pdf', '0068 Purgeur de condensats x.pdf', '0070 (W) Refrigeration dryer T ↑.pdf', '0072 (W) KT Purge de condensat.pdf', '0098 T basse du compresseur.pdf', '0106 Arrêt de sécurité pi Power OFF.pdf', '0200 compresseur moteur USS -1.pdf', '0202 Défaut moteur du compresseur USS.pdf', '0206 compressor moteur USS -1.pdf', '0208 compressor moteur USS -1.pdf', '0231 Compressor motor FC Alarm 0.pdf', '0240 Moteur compresseur alarme USS.pdf', '0242 Moteur compresseur USS -1.pdf', '0243 A Cf du moteur compresseur défaut 30024.pdf', '0245 (S) Moteur de compresseur FU.pdf', '0246 Vitesse SF inf. -n mini.pdf', '0247 Moteur compresseur FC inactive.pdf', '0248 Compressor motor FC off.pdf', '0251 et 0255 Moto refroidisseur Alarme USS.pdf', '0282 Ventilateur refroidisseur huile air USS erreur.pdf', '0287 Ventilateur refroidisseur huile FC inactive.pdf', '0300 Erreur écriture carte SD.pdf', '0305 Moto ventilateur USS error.pdf', '0330 (A) Ventilateur refroidisseur huile Défaut USS.pdf', '0332 Défaut com USS Sinamics.pdf', '0337 Ventilateur refroidisseur huile FC inactive.pdf', '0338 Ventilateur refroidisseur huile FC arrêté.pdf', '0450 (A) Oil-air cooler fan Modbus.pdf', '0500 Coupure de sécurité IOM.pdf', '0801 Slot1 IOM type error.pdf', '0850 IOSlot1 bus error.pdf', '0853 IOSlot  Défaut alimentation.pdf', '0856 IOSlot1 court-circuit.pdf', '0859 IOSlot 1 Erreur température.pdf', '0860 (D) IOSlot_d voltage error.pdf', '0890 Dc AIR 1.00 Court-circuit.pdf', '0902 AIR 1.02 Court-circuit.pdf', '0910 D Coupure sonde AIR1.03.pdf', '1000 Erreur RFID.pdf', '1006 DOT 1.00 Surchauffe.pdf'], 'SC2')">Codes défauts ➜</div><div class="choice-row" onclick="showFiles('Instructions techniques', ['IT_ Maitre Esclave + Programmation à distance.pdf', 'KAESER_CONNECT.pdf', 'Master-slave SC2_via_réseau_Ethernet.pdf', 'Paramétrage marche arrêt à distance.pdf', 'Remplacement_SC2_avec récupération des données_SIP-30003982_01F.pdf', 'Sauvegarde des données sur carte SD fluid_5.1.1.pdf', 'SC2_Réglage capteur de pression externe.pdf'], 'SC2')">Instructions techniques ➜</div>`;
}
function showFiles(title, files, source) {
    if(currentUser !== ADMIN_MAIL) document.getElementById('help-btn-section').style.display = 'block'; 
    updateBackButton(source === 'SC2' ? "showSC2Menu()" : "showSupportHome()"); 
    const mgr = document.getElementById('view-manager');
    mgr.className = "liste-verticale";
    let html = `<h2>${title}</h2>`;
    if(files) files.forEach(f => { html += `<div class="file-row">📄 ${f}<button onclick="openSecurePdf('${f}')" class="btn-open">LIRE</button></div>`; });
    mgr.innerHTML = html;
}
function toggleAcc(id) { const el = document.getElementById(id); if(el) el.style.display = (el.style.display === 'block') ? 'none' : 'block'; }
function filterProducts() { let val = document.getElementById('search-input').value.toLowerCase(); document.querySelectorAll('.card-produit').forEach(c => { c.style.display = c.innerText.toLowerCase().includes(val) ? '' : 'none'; }); }
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 's') e.preventDefault(); });