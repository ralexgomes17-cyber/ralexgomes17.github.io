/* =========================================================
   AETHERIA — Sistema de Fichas de RPG
   Lógica, dados de exemplo, persistência e interações
   ========================================================= */

'use strict';

/* ---------------------------------------------------------
   1. DADOS BASE DO SISTEMA
   --------------------------------------------------------- */

const S = {
    races: ['Humano', 'Elfo', 'Anão', 'Halfling', 'Meio-Orc', 'Tiefling', 'Gnomo', 'Draconato'],
    alignments: ['Leal e Bom', 'Neutro e Bom', 'Caótico e Bom', 'Leal e Neutro', 'Neutro', 'Caótico e Neutro', 'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'],
    classes: {
        guerreiro: {
            name: 'Guerreiro', icon: '⚔️', color: '#a04040',
            desc: 'Mestre das armas e da guerra. Resistente, com ataques poderosos e versátil em combate.',
            hpPerLevel: 10, manaPerLevel: 0,
            recommended: { forca: 16, destreza: 13, constituicao: 15, inteligencia: 10, sabedoria: 12, carisma: 8 },
            skills: ['golpe-poderoso', 'postura-defensiva', 'grito-de-guerra', 'investida']
        },
        mago: {
            name: 'Mago', icon: '🔮', color: '#3a6fb3',
            desc: 'Estudioso das artes arcanas. Frágil, mas capaz de devastar inimigos com feitiços poderosos.',
            hpPerLevel: 6, manaPerLevel: 8,
            recommended: { forca: 8, destreza: 13, constituicao: 12, inteligencia: 16, sabedoria: 12, carisma: 10 },
            skills: ['bala-de-fogo', 'escudo-arcano', 'relampago', 'nevasca']
        },
        ladino: {
            name: 'Ladino', icon: '🗡️', color: '#5a7d3a',
            desc: 'Especialista em furtividade e ataques precisos. Rápido, ágil e letal nos momentos decisivos.',
            hpPerLevel: 8, manaPerLevel: 4,
            recommended: { forca: 10, destreza: 16, constituicao: 12, inteligencia: 13, sabedoria: 10, carisma: 12 },
            skills: ['ataque-furtivo', 'esquiva-agil', 'veneno', 'sombra']
        },
        clerigo: {
            name: 'Clérigo', icon: '⚡', color: '#c9a24b',
            desc: 'Servo da divindade. Equilibra magia sagrada e combate, curando aliados e punindo corrompidos.',
            hpPerLevel: 8, manaPerLevel: 6,
            recommended: { forca: 13, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 16, carisma: 12 },
            skills: ['cura-divina', 'luz-sagrada', 'bencao', 'poder-da-fe']
        },
        paladino: {
            name: 'Paladino', icon: '🛡️', color: '#e0a040',
            desc: 'Cavaleiro sagrado com juramento. Combate corpo a corpo com apoio divino e aura protetora.',
            hpPerLevel: 10, manaPerLevel: 5,
            recommended: { forca: 16, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 12, carisma: 14 },
            skills: ['golpe-sagrado', 'aura-de-protecao', 'julgamento', 'cura-imposicao']
        },
        arqueiro: {
            name: 'Arqueiro', icon: '🏹', color: '#4a7a5a',
            desc: 'Caçador de longa distância. Precisão implacável, rastreamento e ataques à distância.',
            hpPerLevel: 8, manaPerLevel: 3,
            recommended: { forca: 10, destreza: 16, constituicao: 12, inteligencia: 12, sabedoria: 14, carisma: 8 },
            skills: ['tiro-certeiro', 'truque-de-caca', 'chuva-de-flechas', 'olho-de-falcao']
        },
        barbaro: {
            name: 'Bárbaro', icon: '🪓', color: '#8a5a30',
            desc: 'Guerreiro selvagem movido pela fúria. Enorme resistência física e dano brutal em fúria.',
            hpPerLevel: 12, manaPerLevel: 0,
            recommended: { forca: 16, destreza: 13, constituicao: 16, inteligencia: 8, sabedoria: 10, carisma: 10 },
            skills: ['furiaselvagem', 'ataque-de-furia', 'grito-intimidante', 'resistencia-brutal']
        }
    },

    skills: {
        // -- ATAQUE
        'golpe-poderoso': { name: 'Golpe Poderoso', icon: '💥', cat: 'Ataque', cost: 2, cd: 0, dmg: '2d8', desc: 'Golpe que causa dano pesado com a arma.', classes: ['guerreiro', 'barbaro', 'paladino'] },
        'ataque-furtivo': { name: 'Ataque Furtivo', icon: '🔪', cat: 'Ataque', cost: 1, cd: 0, dmg: '2d6', desc: 'Golpe preciso em ponto vital quando o alvo está distraído.', classes: ['ladino'] },
        'bala-de-fogo': { name: 'Bola de Fogo', icon: '🔥', cat: 'Magia', cost: 6, cd: 1, dmg: '8d6', desc: 'Explosão de fogo em área.', classes: ['mago'] },
        'cura-divina': { name: 'Cura Divina', icon: '💚', cat: 'Suporte', cost: 4, cd: 0, dmg: '+3d8', desc: 'Restaura vida de um aliado com energia sagrada.', classes: ['clerigo', 'paladino'] },
        'postura-defensiva': { name: 'Postura Defensiva', icon: '🛡️', cat: 'Defesa', cost: 2, cd: 1, dmg: null, desc: 'Aumenta sua defesa temporariamente.', classes: ['guerreiro', 'paladino'] },
        'grito-de-guerra': { name: 'Grito de Guerra', icon: '📢', cat: 'Suporte', cost: 3, cd: 1, dmg: null, desc: 'Dá bônus de ataque aos aliados por 1 rodada.', classes: ['guerreiro', 'barbaro'] },
        'investida': { name: 'Investida', icon: '🏇', cat: 'Ataque', cost: 1, cd: 0, dmg: '1d10', desc: 'Avança contra o inimigo causando dano extra de deslocamento.', classes: ['guerreiro', 'paladino'] },
        'escudo-arcano': { name: 'Escudo Arcano', icon: '✨', cat: 'Magia', cost: 4, cd: 1, dmg: null, desc: 'Barreira mágica que absorve dano.', classes: ['mago'] },
        'relampago': { name: 'Relâmpago', icon: '⚡', cat: 'Magia', cost: 5, cd: 1, dmg: '4d8', desc: 'Raio de eletricidade que atravessa inimigos.', classes: ['mago'] },
        'nevasca': { name: 'Nevasca', icon: '❄️', cat: 'Magia', cost: 6, cd: 2, dmg: '5d6', desc: 'Tempestade de gelo em área que reduz velocidade.', classes: ['mago'] },
        'esquiva-agil': { name: 'Esquiva Ágil', icon: '💨', cat: 'Defesa', cost: 1, cd: 1, dmg: null, desc: 'Esquiva reativa, reduzindo dano recebido.', classes: ['ladino', 'arqueiro'] },
        'veneno': { name: 'Veneno Letal', icon: '🧪', cat: 'Ataque', cost: 3, cd: 0, dmg: '2d4', desc: 'Envenena a arma, causando dano adicional.', classes: ['ladino'] },
        'sombra': { name: 'Passo das Sombras', icon: '🌑', cat: 'Defesa', cost: 2, cd: 1, dmg: null, desc: 'Torna-se invisível por um curto momento.', classes: ['ladino'] },
        'luz-sagrada': { name: 'Luz Sagrada', icon: '🌟', cat: 'Magia', cost: 4, cd: 1, dmg: '3d6', desc: 'Destrói mortos-vivos e causa dano sagrado.', classes: ['clerigo'] },
        'bencao': { name: 'Bênção', icon: '🙏', cat: 'Suporte', cost: 3, cd: 1, dmg: null, desc: 'Bênção que aumenta defesa de todos os aliados.', classes: ['clerigo'] },
        'poder-da-fe': { name: 'Poder da Fé', icon: '💫', cat: 'Suporte', cost: 2, cd: 0, dmg: null, desc: 'Cura leve e purifica condições.', classes: ['clerigo'] },
        'golpe-sagrado': { name: 'Golpe Sagrado', icon: '☀️', cat: 'Ataque', cost: 3, cd: 0, dmg: '3d8', desc: 'Golpe imbuído de energia divina.', classes: ['paladino'] },
        'aura-de-protecao': { name: 'Aura de Proteção', icon: '🕊️', cat: 'Defesa', cost: 4, cd: 1, dmg: null, desc: 'Aura que protege aliados próximos.', classes: ['paladino'] },
        'julgamento': { name: 'Julgamento', icon: '⚖️', cat: 'Ataque', cost: 5, cd: 2, dmg: '4d8', desc: 'Smite devastador contra o mal.', classes: ['paladino'] },
        'cura-imposicao': { name: 'Imposição de Mãos', icon: '🤲', cat: 'Suporte', cost: 4, cd: 0, dmg: '+4d6', desc: 'Cura poderosa pelo toque.', classes: ['paladino'] },
        'tiro-certeiro': { name: 'Tiro Certeiro', icon: '🎯', cat: 'Ataque', cost: 2, cd: 0, dmg: '2d10', desc: 'Disparo preciso que ignora cobertura.', classes: ['arqueiro'] },
        'truque-de-caca': { name: 'Sinal do Caçador', icon: '🦌', cat: 'Ataque', cost: 1, cd: 1, dmg: '3d8', desc: 'Marca o alvo, aumentando dano crítico.', classes: ['arqueiro'] },
        'chuva-de-flechas': { name: 'Chuva de Flechas', icon: '🌧️', cat: 'Ataque', cost: 6, cd: 2, dmg: '6d6', desc: 'Saraivada de flechas em área.', classes: ['arqueiro'] },
        'olho-de-falcao': { name: 'Olho de Falcão', icon: '🦅', cat: 'Suporte', cost: 2, cd: 1, dmg: null, desc: 'Aumenta precisão e percepção do grupo.', classes: ['arqueiro'] },
        'furiaselvagem': { name: 'Fúria Selvagem', icon: '🐺', cat: 'Defesa', cost: 3, cd: 1, dmg: null, desc: 'Entra em fúria, reduzindo dano e aumentando força.', classes: ['barbaro'] },
        'ataque-de-furia': { name: 'Ataque de Fúria', icon: '🌋', cat: 'Ataque', cost: 1, cd: 0, dmg: '2d6', desc: 'Ataque brutal alimentado pela raiva.', classes: ['barbaro'] },
        'grito-intimidante': { name: 'Grito Intimidante', icon: '😱', cat: 'Suporte', cost: 2, cd: 1, dmg: null, desc: 'Intimida inimigos, reduzindo a defesa deles.', classes: ['barbaro'] },
        'resistencia-brutal': { name: 'Resistência Brutal', icon: '🪨', cat: 'Defesa', cost: 2, cd: 1, dmg: null, desc: 'Ignore dano com pura resistência física.', classes: ['barbaro'] }
    },

    items: {
        // Armas
        'espada-longa': { name: 'Espada Longa', icon: '🗡️', cat: 'armas', weight: 3, value: 15, dmg: '1d8', atkBonus: 2, desc: 'Espada de uma mão confiável' },
        'espada-grande': { name: 'Espada Grande', icon: '⚔️', cat: 'armas', weight: 6, value: 50, dmg: '2d6', atkBonus: 2, desc: 'Espada colossal de duas mãos' },
        'machado-de-batalha': { name: 'Machado de Batalha', icon: '🪓', cat: 'armas', weight: 4, value: 30, dmg: '1d10', atkBonus: 1, desc: 'Machado pesado de guerra' },
        'arco-longo': { name: 'Arco Longo', icon: '🏹', cat: 'armas', weight: 2, value: 50, dmg: '1d8', atkBonus: 2, desc: 'Arco de madeira resistente' },
        'cajado-arcano': { name: 'Cajado Arcano', icon: '🪄', cat: 'armas', weight: 4, value: 100, dmg: '1d6', atkBonus: 1, desc: 'Cajado imbuído de poder mágico' },
        'adaga': { name: 'Adaga', icon: '🔪', cat: 'armas', weight: 1, value: 5, dmg: '1d4', atkBonus: 2, desc: 'Lâmina curta e versátil' },
        // Armaduras
        'armadura-de-coura': { name: 'Couro Batido', icon: '🧥', cat: 'armaduras', weight: 13, value: 45, def: 12, desc: 'Armadura de couro reforçado' },
        'cota-de-malha': { name: 'Cota de Malha', icon: '⛓️', cat: 'armaduras', weight: 40, value: 75, def: 16, desc: 'Armadura de elos de aço' },
        'placa-completa': { name: 'Placa Completa', icon: '🛡️', cat: 'armaduras', weight: 65, value: 1500, def: 18, desc: 'Armadura de placas inteiras' },
        'manto-de-mago': { name: 'Manto Arcano', icon: '🧙', cat: 'armaduras', weight: 4, value: 100, def: 11, desc: 'Manto com deflexão mágica' },
        'armadura-de-couro': { name: 'Armadura de Couro', icon: '👕', cat: 'armaduras', weight: 10, value: 10, def: 11, desc: 'Armadura simples de couro' },
        // Escudos
        'escudo-de-madeira': { name: 'Escudo de Madeira', icon: '🛟', cat: 'escudos', weight: 6, value: 10, def: 2, desc: 'Escudo leve de madeira' },
        'escudo-de-ferro': { name: 'Escudo de Ferro', icon: '🛡️', cat: 'escudos', weight: 12, value: 30, def: 3, desc: 'Escudo resistente de ferro' },
        // Poções
        'pocao-de-cura': { name: 'Poção de Cura', icon: '🧪', cat: 'pocoes', weight: 0.5, value: 50, heal: '2d4', desc: 'Restaura 2d4 de vida', qty: 3 },
        'pocao-de-mana': { name: 'Poção de Mana', icon: '⚗️', cat: 'pocoes', weight: 0.5, value: 60, mana: 10, desc: 'Restaura 10 de mana' },
        'pocao-de-forca': { name: 'Poção de Força', icon: '💪', cat: 'pocoes', weight: 0.5, value: 120, buff: 'forca', desc: 'Aumenta força temporariamente' },
        // Itens mágicos
        'anel-de-protecao': { name: 'Anel de Proteção', icon: '💍', cat: 'magicos', weight: 0.1, value: 800, def: 1, desc: 'Aura protetora sutil' },
        'amuleto-de-mana': { name: 'Amuleto de Mana', icon: '📿', cat: 'magicos', weight: 0.2, value: 500, manaBonus: 10, desc: 'Aumenta mana máxima' },
        'pedra-do-sol': { name: 'Pedra do Sol', icon: '💎', cat: 'magicos', weight: 0.1, value: 2000, desc: 'Joia rara que brilha como o sol' },
        // Outros
        'corda': { name: 'Corda (15m)', icon: '🪢', cat: 'outros', weight: 5, value: 2, desc: 'Corda resistente de cânhamo' },
        'tocha': { name: 'Tocha', icon: '🔥', cat: 'outros', weight: 1, value: 0.2, desc: 'Ilumina 10 metros por 1 hora' },
        'frasco-de-oleo': { name: 'Frasco de Óleo', icon: '🛢️', cat: 'outros', weight: 1, value: 0.4, desc: 'Inflamável, útil para armadilhas' },
        'mochila': { name: 'Mochila de Viagem', icon: '🎒', cat: 'outros', weight: 5, value: 2, desc: 'Carrega suprimentos' },
        'saco-de-dormir': { name: 'Saco de Dormir', icon: '🛏️', cat: 'outros', weight: 7, value: 1, desc: 'Para noites no acampamento' }
    }
};

/* Ordem + modificador */
const ATTR_ORDER = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];
const ATTR_LABELS = { forca: 'Força', destreza: 'Destreza', constituicao: 'Constituição', inteligencia: 'Inteligência', sabedoria: 'Sabedoria', carisma: 'Carisma' };
const ATTR_ICONS = { forca: '💪', destreza: '🏃', constituicao: '❤️', inteligencia: '🧠', sabedoria: '👁️', carisma: '🎭' };
const CAT_ORDER = ['Ataque', 'Defesa', 'Magia', 'Suporte', 'Passivas'];
const CAT_ICONS = { Ataque: '⚔️', Defesa: '🛡️', Magia: '🔮', Suporte: '💚', Passivas: '✨' };

const STORAGE_KEY = 'aetheria_characters_v1';
const DICE_TYPES = [
    { sides: 4, label: 'd4', icon: '🔺' },
    { sides: 6, label: 'd6', icon: '⬛' },
    { sides: 8, label: 'd8', icon: '🔶' },
    { sides: 10, label: 'd10', icon: '🔷' },
    { sides: 12, label: 'd12', icon: '⭐' },
    { sides: 20, label: 'd20', icon: '🈵' },
    { sides: 100, label: 'd100', icon: '🎱' }
];

/* ---------------------------------------------------------
   2. ESTADO GLOBAL
   --------------------------------------------------------- */
let characters = loadCharacters();
let currentCharId = null;
let currentEditing = null; // personagem em criação
let step = 1;
const MAX_STEP = 6;
const POINTS = 27;
let pointsLeft = POINTS;
let diceHistory = loadDiceHistory();
let chosenClass = null;
let selectedSkills = [];
let selectedItems = [];
let currentTab = 'combat';

/* ---------------------------------------------------------
   3. UTILITÁRIOS
   --------------------------------------------------------- */
function $(id) { return document.getElementById(id); }
function loadCharacters() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}
function loadDiceHistory() {
    try {
        const raw = localStorage.getItem('aetheria_dice_history');
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}
function saveCharacters() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(characters)); } catch {}
}
function saveDiceHistory() {
    try { localStorage.setItem('aetheria_dice_history', JSON.stringify(diceHistory.slice(0, 100))); } catch {}
}
function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function modFor(score) { return Math.floor((score - 10) / 2); }
function fmtMod(m) { return (m >= 0 ? '+' : '') + m; }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }
function rollFormula(formula) {
    const clean = formula.replace(/\s+/g, '');
    const diceMatch = clean.match(/(\d+)?d(\d+)/g) || [];
    let remaining = clean;
    let total = 0; const parts = [];
    for (const m of diceMatch) {
        const [, nStr, sStr] = m.match(/(\d+)?d(\d+)/);
        const n = parseInt(nStr || '1'); const s = parseInt(sStr);
        let subtotal = 0; const rolls = [];
        for (let i = 0; i < n; i++) { const r = rollDie(s); rolls.push(r); subtotal += r; }
        total += subtotal;
        parts.push(`${n}d${s} = (${rolls.join(', ')}) = ${subtotal}`);
        remaining = remaining.replace(m, subtotal);
    }
    let final = total;
    if (remaining) {
        final = eval(remaining); // fórmula simples restante (+/-, números)
    }
    return { total: final, parts };
}
function greeting() { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; }

/* ---------------------------------------------------------
   4. NAVEGAÇÃO
   --------------------------------------------------------- */
function goTo(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    $('view-' + view).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === view));
    if (view === 'library') { renderLibrary(); updateCharCount(); }
    if (view === 'dice') { renderDiceGrid(); renderDiceHistory(); }
    if (view === 'creatures') { renderCreatureList(); renderCombat(); renderPlayerPicker(); }
    if (view === 'home') {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'create' && !editingChar) { initCreation(); }
}
let editingChar = false;

/* ---------------------------------------------------------
   5. CRIAÇÃO DE PERSONAGEM
   --------------------------------------------------------- */
function initCreation() {
    editingChar = false;
    currentEditing = { id: null, name: '', player: '', age: '', alignment: 'Neutro', level: 1, xp: 0, origin: '', race: 'Humano', classId: null, attrs: {}, hp: 0, mana: 0, skills: [], items: [], gold: 100 };
    chosenClass = null; selectedSkills = []; selectedItems = []; pointsLeft = POINTS; step = 1;
    currentEditing.attrs = {};
    ATTR_ORDER.forEach(a => currentEditing.attrs[a] = 8);
    $('fName').value = ''; $('fPlayer').value = ''; $('fAge').value = ''; $('fXP').value = 0;
    $('fOrigin').value = '';
    $('fAlignment').innerHTML = S.alignments.map(a => `<option ${a === 'Neutro' ? 'selected' : ''}>${a}</option>`).join('');
    $('fLevel').value = 1;
    renderSteps(); showStep(1);
    renderClassGrid(); renderAttrGrid(); renderSkillsPicker(); renderEquipPicker();
}
function renderSteps() {
    document.querySelectorAll('.step').forEach((el, i) => {
        const n = i + 1;
        el.classList.toggle('active', n === step);
        el.classList.toggle('complete', n < step);
    });
}
function showStep(n) {
    step = n;
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    const panel = document.querySelector(`.step-panel[data-panel="${n}"]`);
    if (panel) panel.classList.add('active');
    renderSteps();
    if (n === 6) renderReview();
}
function nextStep() {
    if (step === 1 && !validateBasic()) return;
    if (step === 2 && !chosenClass) { alertToast('Escolha uma classe para continuar.'); return; }
    if (step === 3 && pointsLeft > 0) { alertToast('Distribua todos os pontos de atributo.'); return; }
    if (step === 4 && selectedSkills.length === 0) { alertToast('Selecione ao menos 1 habilidade.'); return; }
    if (step < MAX_STEP) showStep(step + 1);
}
function prevStep() { if (step > 1) showStep(step - 1); }
function validateBasic() {
    let ok = true;
    const name = $('fName').value.trim(), player = $('fPlayer').value.trim(), age = $('fAge').value, xp = $('fXP').value;
    $('errName').textContent = name ? '' : 'Nome é obrigatório.';
    if (!name) ok = false;
    $('errPlayer').textContent = player ? '' : 'Nome do jogador é obrigatório.';
    if (!player) ok = false;
    $('errAge').textContent = (age && age > 0 && age <= 120) ? '' : 'Idade inválida (1-120).';
    if (!age || age <= 0 || age > 120) ok = false;
    $('errXP').textContent = (xp && xp >= 0) ? '' : 'XP deve ser 0 ou mais.';
    if (xp === '' || xp < 0) ok = false;
    if (ok) {
        currentEditing.name = name; currentEditing.player = player;
        currentEditing.age = age; currentEditing.alignment = $('fAlignment').value;
        currentEditing.level = parseInt($('fLevel').value, 10);
        currentEditing.xp = parseInt(xp || 0, 10);
        currentEditing.origin = $('fOrigin').value.trim();
    }
    ['fName', 'fPlayer', 'fAge', 'fXP'].forEach(id => $(id).classList.toggle('error', $(id).value === '' || (id === 'fAge' && $('fAge').value !== '' && ($('fAge').value <= 0 || $('fAge').value > 120)) || (id === 'fXP' && ($('fXP').value === '' || $('fXP').value < 0))));
    return ok;
}

/* Classe */
function renderClassGrid() {
    const g = $('classGrid');
    g.innerHTML = Object.entries(S.classes).map(([id, c]) => `
        <div class="class-card ${chosenClass === id ? 'selected' : ''}" onclick="selectClass('${id}')" style="border-color:${chosenClass === id ? c.color : ''}">
            <div class="class-icon">${c.icon}</div>
            <div class="class-name">${c.name}</div>
            <div class="class-desc">${c.desc}</div>
            <div class="class-meta">
                <span class="class-tag">❤️ ${c.hpPerLevel} PV/nível</span>
                ${c.manaPerLevel ? `<span class="class-tag">🔮 ${c.manaPerLevel} Mana/nível</span>` : '<span class="class-tag">Sem Mana</span>'}
            </div>
        </div>`).join('');
}
function selectClass(id) {
    chosenClass = id;
    const c = S.classes[id];
    currentEditing.classId = id;
    // aplica atributos recomendados
    ATTR_ORDER.forEach(a => currentEditing.attrs[a] = c.recommended[a]);
    pointsLeft = POINTS - ATTR_ORDER.reduce((s, a) => s + c.recommended[a], 0);
    // vida e mana
    currentEditing.hp = c.hpPerLevel * currentEditing.level;
    currentEditing.mana = c.manaPerLevel * currentEditing.level;
    renderClassGrid(); renderAttrGrid();
    // pré-seleciona habilidades da classe
    selectedSkills = []; selectedItems = [];
    c.skills.forEach(s => { if (!selectedSkills.includes(s)) selectedSkills.push(s); });
    renderSkillsPicker();
    // equipamentos iniciais padrão por classe via recomendação
    const defaults = defaultItemsForClass(id);
    selectedItems = defaults.map(di => ({ id: di, qty: 1 }));
    renderEquipPicker();
    alertToast(`Classe ${c.name} selecionada!`);
}
function defaultItemsForClass(classId) {
    const map = {
        guerreiro: ['espada-longa', 'cota-de-malha', 'escudo-de-ferro', 'pocao-de-cura', 'tocha', 'mochila'],
        mago: ['cajado-arcano', 'manto-de-mago', 'pocao-de-mana', 'pocao-de-cura', 'tocha'],
        ladino: ['adaga', 'adaga', 'armadura-de-couro', 'pocao-de-cura', 'corda', 'mochila'],
        clerigo: ['machado-de-batalha', 'cota-de-malha', 'escudo-de-madeira', 'pocao-de-cura', 'tocha'],
        paladino: ['espada-longa', 'placa-completa', 'escudo-de-ferro', 'pocao-de-cura', 'tocha'],
        arqueiro: ['arco-longo', 'armadura-de-coura', 'pocao-de-cura', 'corda', 'mochila'],
        barbaro: ['espada-grande', 'armadura-de-coura', 'pocao-de-cura', 'pocao-de-cura', 'tocha']
    };
    return map[classId] || ['adaga', 'armadura-de-couro', 'pocao-de-cura'];
}

/* Atributos */
function renderAttrGrid() {
    const g = $('attrGrid');
    $('pointsLeft').textContent = pointsLeft;
    g.innerHTML = ATTR_ORDER.map(a => {
        const v = currentEditing.attrs[a];
        const m = modFor(v);
        return `<div class="attr-row">
            <div class="attr-name">${ATTR_ICONS[a]} ${ATTR_LABELS[a]}</div>
            <div class="attr-value">
                <button class="attr-btn" onclick="adjustAttr('${a}', -1)" ${v <= 8 ? 'disabled' : ''}>−</button>
                <div class="attr-num">${v}</div>
                <button class="attr-btn" onclick="adjustAttr('${a}', 1)" ${pointsLeft <= 0 ? 'disabled' : ''}>+</button>
            </div>
            <div class="attr-mod ${m < 0 ? 'neg' : ''}">mod ${fmtMod(m)}</div>
        </div>`;
    }).join('');
}
function adjustAttr(attr, delta) {
    if (delta > 0 && pointsLeft <= 0) return;
    if (delta < 0 && currentEditing.attrs[attr] <= 8) return;
    const nd = currentEditing.attrs[attr] + delta;
    if (nd < 8 || nd > 18) return;
    currentEditing.attrs[attr] = nd;
    pointsLeft -= delta;
    renderAttrGrid();
}

/* Habilidades */
function renderSkillsPicker() {
    const cats = {}; CAT_ORDER.forEach(c => cats[c] = []);
    Object.entries(S.skills).forEach(([id, sk]) => {
        const catKey = CAT_ORDER.includes(sk.cat) ? sk.cat : 'Passivas';
        cats[catKey] = cats[catKey] || [];
        cats[catKey].push({ id, ...sk });
    });
    const container = $('skillsCategories');
    container.innerHTML = [
        `<div class="skill-pick-count">Selecionadas: <b id="skillsPickCount">${selectedSkills.length}</b> / 5</div>`,
        ...CAT_ORDER.map(cat => {
            if (!cats[cat] || cats[cat].length === 0) return '';
            return `<div class="skill-cat-title">${CAT_ICONS[cat]} ${cat === 'Passivas' ? 'Passivas' : cat}</div>
            <div class="skill-cards">
                ${cats[cat].map(sk => {
                    const allowed = !sk.classes || sk.classes.includes(chosenClass || '') || sk.cat !== 'Ataque';
                    const selected = selectedSkills.includes(sk.id);
                    const locked = !allowed;
                    return `<div class="skill-card ${selected ? 'selected' : ''} ${locked ? 'locked' : ''}" onclick="${locked ? '' : `toggleSkill('${sk.id}')`}">
                        <div class="skill-top">
                            <span class="skill-emoji">${sk.icon}</span>
                            <span class="skill-name">${sk.name}</span>
                        </div>
                        <div class="skill-meta">
                            <span class="skill-tag cost">🔮 ${sk.cost}</span>
                            <span class="skill-tag cooldown">⏳ ${sk.cd || 0} rec.</span>
                            ${sk.dmg ? `<span class="skill-tag damage">💥 ${sk.dmg}</span>` : ''}
                            ${sk.classes ? '<span class="skill-tag classskill">' + sk.classes.map(x => S.classes[x]?.name).join('/') + '</span>' : ''}
                        </div>
                        <div class="skill-desc">${sk.desc}</div>
                    </div>`;
                }).join('')}
            </div>`;
        }).join('')
    ].join('');
    const el = $('skillsPickCount');
    if (el) el.textContent = selectedSkills.length;
}
function toggleSkill(id) {
    const idx = selectedSkills.indexOf(id);
    if (idx >= 0) { selectedSkills.splice(idx, 1); }
    else {
        if (selectedSkills.length >= 5) { alertToast('Máximo de 5 habilidades.'); return; }
        const sk = S.skills[id];
        if (sk.classes && !sk.classes.includes(chosenClass) && sk.cat !== 'Passivas') { alertToast('Essa habilidade não é da sua classe.'); return; }
        selectedSkills.push(id);
    }
    renderSkillsPicker();
}

/* Equipamentos */
function renderEquipPicker() {
    const cats = { armas: '⚔️ Armas', armaduras: '🛡️ Armaduras', escudos: '🛟 Escudos', pocoes: '🧪 Poções', magicos: '💎 Itens Mágicos', outros: '🎒 Outros' };
    const container = $('equipPicker');
    container.innerHTML = Object.entries(cats).map(([key, label]) => {
        const items = Object.entries(S.items).filter(([, it]) => it.cat === key);
        return `<div class="skill-cat-title">${label}</div>
        <div class="equip-items">
            ${items.map(([id, it]) => {
                const selected = selectedItems.some(si => si.id === id);
                return `<div class="item-picker ${selected ? 'selected' : ''}" onclick="toggleItem('${id}')">
                    <span class="item-emoji">${it.icon}</span>
                    <div class="item-info">
                        <div class="item-name">${it.name}</div>
                        <div class="item-detail">Peso ${it.weight} kg · ${it.value} PC</div>
                    </div>
                    ${selected ? '<span style="color:var(--gold-bright)">✔</span>' : ''}
                </div>`;
            }).join('')}
        </div>`;
    }).join('');
}
function toggleItem(id) {
    const idx = selectedItems.findIndex(si => si.id === id);
    if (idx >= 0) selectedItems.splice(idx, 1);
    else selectedItems.push({ id, qty: 1 });
    renderEquipPicker();
}

/* Revisão */
function renderReview() {
    const c = currentEditing;
    const cls = c.classId ? S.classes[c.classId] : null;
    const totalW = selectedItems.reduce((s, si) => s + (S.items[si.id]?.weight || 0), 0);
    $('reviewBox').innerHTML = `
        <div class="review-section"><h4>🧙 Personagem</h4><ul>
            <li><b>${esc(c.name)}</b> (${esc(c.age)} anos)</li>
            <li>Jogador: ${esc(c.player)}</li>
            <li>Alinhamento: ${esc(c.alignment)}</li>
            <li>Nível ${c.level} · ${c.xp} XP</li>
            ${cls ? `<li>Classe: ${cls.icon} ${cls.name}</li>` : '<li>Sem classe</li>'}
        </ul></div>
        <div class="review-section"><h4>⚔️ Atributos</h4><ul>
            ${ATTR_ORDER.map(a => `<li>${ATTR_LABELS[a]}: ${c.attrs[a]} (${fmtMod(modFor(c.attrs[a]))})</li>`).join('')}
        </ul></div>
        <div class="review-section"><h4>✨ Habilidades</h4><ul>
            ${selectedSkills.length ? selectedSkills.map(id => `<li>${S.skills[id].icon} ${S.skills[id].name}</li>`).join('') : '<li>Nenhuma</li>'}
        </ul></div>
        <div class="review-section"><h4>🎒 Equipamentos</h4><ul>
            ${selectedItems.length ? selectedItems.map(si => `<li>${S.items[si.id].icon} ${S.items[si.id].name} (${si.qty})</li>`).join('') : '<li>Vazio</li>'}
            <li>Peso: ${totalW.toFixed(1)} kg</li>
        </ul></div>
        <div class="review-section"><h4>💖 Vida & Mana</h4><ul>
            <li>PV: ${c.hp}</li>
            <li>Mana: ${c.mana}</li>
        </ul></div>
    `;
}

/* Finalizar */
function finishCharacterCreation() {
    editingChar = false;
    if (!validateBasic()) { showStep(1); return; }
    if (!chosenClass) { showStep(2); alertToast('Escolha uma classe.'); return; }
    const cls = S.classes[chosenClass];
    const isEdit = currentEditing && currentEditing.id;
    if (isEdit) {
        const existing = findChar(currentEditing.id);
        if (!existing) { alertToast('Erro: ficha não encontrada.'); return; }
        existing.name = currentEditing.name;
        existing.player = currentEditing.player;
        existing.age = currentEditing.age;
        existing.alignment = currentEditing.alignment;
        existing.level = currentEditing.level;
        existing.xp = currentEditing.xp;
        existing.origin = currentEditing.origin || '';
        existing.classId = chosenClass;
        existing.className = cls.name;
        existing.portrait = cls.icon;
        existing.attrs = { ...currentEditing.attrs };
        existing.skills = [...selectedSkills];
        existing.items = selectedItems.map(si => ({ ...si }));
        const newMax = cls.hpPerLevel * currentEditing.level;
        if (!existing.hpMax || existing.hpMax !== newMax) existing.hpMax = newMax;
        existing.hpCur = Math.min(existing.hpCur ?? newMax, existing.hpMax);
        const newMana = cls.manaPerLevel * currentEditing.level;
        if (!existing.manaMax || existing.manaMax !== newMana) existing.manaMax = newMana;
        existing.manaCur = Math.min(existing.manaCur ?? newMana, existing.manaMax);
        existing.updatedAt = Date.now();
        saveCharacters();
        currentCharId = existing.id;
        alertToast(`✏️ ${existing.name} atualizado com sucesso!`);
        goTo('sheet');
        renderSheet(existing);
        return;
    }
    const char = {
        id: uid(),
        name: currentEditing.name,
        player: currentEditing.player,
        age: parseInt(currentEditing.age, 10),
        alignment: currentEditing.alignment,
        level: currentEditing.level,
        xp: currentEditing.xp,
        origin: currentEditing.origin || '',
        race: 'Humano',
        portrait: cls.icon,
        classId: chosenClass,
        className: cls.name,
        hpMax: currentEditing.hp,
        hpCur: currentEditing.hp,
        manaMax: currentEditing.mana,
        manaCur: currentEditing.mana,
        attrs: { ...currentEditing.attrs },
        skills: [...selectedSkills],
        items: selectedItems.map(si => ({ ...si })),
        gold: 100,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    characters.push(char);
    saveCharacters();
    currentCharId = char.id;
    alertToast(`✨ ${char.name} criado com sucesso!`);
    goTo('sheet');
    renderSheet(char);
}
function showStepIf() {}

/* ---------------------------------------------------------
   6. BIBLIOTECA (MINHAS FICHAS)
   --------------------------------------------------------- */
function updateCharCount() {
    const b = $('charCountBadge');
    if (b) b.textContent = characters.length;
}
function renderLibrary() {
    const container = $('charCards');
    updateCharCount();
    if (characters.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <div class="empty-icon">📜</div>
            <h3>Nenhum personagem ainda</h3>
            <p>Crie seu primeiro herói aventureiro!</p>
            <br><button class="btn btn-gold" onclick="goTo('create')">✚ Criar Personagem</button>
        </div>`;
        return;
    }
    container.innerHTML = characters.map(c => {
        const cls = S.classes[c.classId] || {};
        const hpPct = Math.max(0, Math.round((c.hpCur / c.hpMax) * 100));
        const lastEdit = new Date(c.updatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return `<div class="char-card">
            <div class="char-card-top">
                <div class="char-avatar">${esc(c.portrait || '🧙')}</div>
                <div>
                    <div class="char-card-name">${esc(c.name)}</div>
                    <div class="char-card-class">${esc(c.className || '')} · Nível ${c.level}</div>
                </div>
            </div>
            <div class="char-card-body">
                <div class="char-stat-line"><span>❤️ PV</span><b>${c.hpCur}/${c.hpMax} (${hpPct}%)</b></div>
                <div class="char-stat-line"><span>🔮 Mana</span><b>${c.manaCur}/${c.manaMax}</b></div>
                <div class="char-stat-line"><span>✨ XP</span><b>${c.xp} XP</b></div>
                <div class="char-stat-line"><span>🕐 Última alteração</span><b>${lastEdit}</b></div>
            </div>
            <div class="char-card-actions">
                <button class="btn btn-gold" onclick="openCharacter('${c.id}')">Abrir</button>
                <button class="btn btn-secondary" onclick="editMode('${c.id}')">✏️ Editar</button>
                <button class="btn btn-secondary" onclick="duplicateCharacter('${c.id}')">📋 Duplicar</button>
                <button class="btn btn-danger" onclick="askDelete('${c.id}')">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

/* Ações na biblioteca */
function openCharacter(id) {
    const c = characters.find(x => x.id === id);
    if (!c) return;
    currentCharId = id;
    resetTab();
    goTo('sheet');
    renderSheet(c);
}
function editMode(id) {
    const c = characters.find(x => x.id === id);
    if (!c) return;
    currentEditing = {
        id: c.id, name: c.name, player: c.player, age: c.age, alignment: c.alignment,
        level: c.level, xp: c.xp, origin: c.origin, race: c.race,
        classId: c.classId || null, attrs: { ...c.attrs }, hp: c.hpMax, mana: c.manaMax,
        skills: [...c.skills], items: c.items.map(i => ({ ...i })), gold: c.gold
    };
    chosenClass = c.classId || null;
    selectedSkills = [...c.skills];
    selectedItems = c.items.map(i => ({ ...i }));
    const spent = ATTR_ORDER.reduce((s, a) => s + (c.attrs[a] - 8), 0);
    pointsLeft = Math.max(0, POINTS - spent);
    // preencher formulário
    $('fName').value = c.name; $('fPlayer').value = c.player; $('fAge').value = c.age;
    $('fXP').value = c.xp; $('fOrigin').value = c.origin || '';
    $('fAlignment').innerHTML = S.alignments.map(a => `<option ${a === c.alignment ? 'selected' : ''}>${a}</option>`).join('');
    $('fLevel').value = c.level;
    step = 1;
    editingChar = true;
    showStep(1);
    renderClassGrid(); renderAttrGrid(); renderSkillsPicker(); renderEquipPicker();
    goTo('create');
    alertToast(`Editando ${c.name} — use as etapas e Finalizar para salvar.`);
}
function duplicateCharacter(id) {
    const c = characters.find(x => x.id === id);
    if (!c) return;
    const copy = JSON.parse(JSON.stringify(c));
    copy.id = uid();
    copy.name = c.name + ' (cópia)';
    copy.createdAt = Date.now(); copy.updatedAt = Date.now();
    characters.push(copy);
    saveCharacters();
    renderLibrary();
    alertToast('Ficha duplicada!');
}
function askDelete(id) {
    const c = characters.find(x => x.id === id);
    if (!c) return;
    showConfirm('Excluir personagem?', `"${c.name}" será excluído permanentemente. Esta ação não pode ser desfeita.`, () => {
        characters = characters.filter(x => x.id !== id);
        saveCharacters();
        combat.players = combat.players.filter(p => characters.some(c => c.id === p));
        saveCombat();
        renderLibrary();
        alertToast('Ficha excluída.');
        if (currentCharId === id) currentCharId = null;
    });
}

/* ---------------------------------------------------------
   7. FICHA (PLACA COMPLETA)
   --------------------------------------------------------- */
function resetTab() { currentTab = 'combat'; }
function renderSheet(c) {
    currentCharId = c.id;
    const cls = S.classes[c.classId] || {};
    $('sheetName').textContent = c.name;
    $('sheetClassLine').textContent = `${cls.icon || ''} ${c.className || ''} · Nível ${c.level} · ${c.race || 'Humano'}`;
    $('sheetPortrait').textContent = c.portrait || cls.icon || '🧙';
    $('sheetPortraitName').textContent = c.name;
    $('sheetPortraitRace').textContent = `${c.race || 'Humano'} · ${c.className || ''}`;
    // Barras
    $('sheetHPFill').style.width = hpPct(c) + '%';
    $('sheetHPText').textContent = `${c.hpCur}/${c.hpMax}`;
    $('sheetManaFill').style.width = manaPct(c) + '%';
    $('sheetManaText').textContent = `${c.manaCur}/${c.manaMax}`;
    $('sheetXPFill').style.width = xpPct(c) + '%';
    $('sheetXPText').textContent = `${c.xp} XP`;
    $('sheetXPFill').style.width = xpPct(c) + '%';
    renderSheetAttrs(c);
    renderSheetSkills(c);
    renderSheetEquip(c);
    renderSheetInfo(c);
    renderCombatLog('✨ Ficha de ' + c.name + ' carregada.', 'info');
    showTab(currentTab);
}
function hpPct(c) { return Math.max(0, Math.min(100, (c.hpCur / (c.hpMax || 1)) * 100)); }
function manaPct(c) { return Math.max(0, Math.min(100, (c.manaCur / (c.manaMax || 1)) * 100)); }
function xpPct(c) { const next = c.level * 100; return Math.max(0, Math.min(100, (c.xp / (next || 1)) * 100)); }
function renderSheetAttrs(c) {
    $('sheetAttrs').innerHTML = ATTR_ORDER.map(a => {
        const v = c.attrs[a]; const m = modFor(v);
        return `<div class="sheet-attr ${m < 0 ? 'neg' : ''}" onclick="editAttrValue('${c.id}', '${a}')" title="Clique para editar">
            <div class="sheet-attr-name">${a.slice(0, 3)}</div>
            <div class="sheet-attr-val">${v}</div>
            <div class="sheet-attr-mod">${fmtMod(m)}</div>
        </div>`;
    }).join('');
}
let editTarget = null;
function editAttrValue(charId, attr) {
    editTarget = { charId, attr };
    $('editValueInput').value = findChar(charId).attrs[attr];
    $('editModal').classList.add('show');
}
function saveEditValue() {
    const v = parseInt($('editValueInput').value, 10);
    if (isNaN(v)) return;
    if (editTarget) {
        const c = findChar(editTarget.charId);
        const clamped = Math.max(1, Math.min(20, v));
        const old = c.attrs[editTarget.attr];
        c.attrs[editTarget.attr] = clamped;
        c.hpMax = Math.max(c.hpMax, S.classes[c.classId]?.hpPerLevel * c.level || c.hpMax);
        c.hpCur = Math.min(c.hpCur, c.hpMax);
        c.updatedAt = Date.now();
        saveCharacters();
        renderSheet(c);
        renderLibrary();
        renderCombatLog(`Atributo ${ATTR_LABELS[editTarget.attr]} alterado: ${old} → ${clamped}.`, 'info');
    }
    closeEditModal();
}
function findChar(id) { return characters.find(x => x.id === id); }

function renderSheetSkills(c) {
    const container = $('sheetSkills');
    const useables = c.skills.map(id => ({ id, ...(S.skills[id] || {}) })).filter(s => s && s.name);
    if (!useables.length) { container.innerHTML = '<div class="info-box">Nenhuma habilidade.</div>'; return; }
    container.innerHTML = useables.map(s => `
        <div class="sheet-skill">
            <span class="skill-emoji">${s.icon}</span>
            <div class="skill-info">
                <div class="skill-name">${s.name}</div>
                <div class="skill-desc">${s.desc}</div>
                <div class="skill-meta" style="margin-top:4px">
                    <span class="skill-tag cost">🔮 ${s.cost || 0}</span>
                    <span class="skill-tag cooldown">⏳ ${s.cd || 0} rec.</span>
                    ${s.dmg ? `<span class="skill-tag damage">💥 ${s.dmg}</span>` : ''}
                </div>
            </div>
            <button class="btn btn-primary" style="padding:7px 12px;font-size:0.78rem" onclick="useSkill('${c.id}','${s.id}')">Usar</button>
        </div>`).join('');
}
function renderSheetEquip(c) {
    const container = $('sheetEquip');
    if (!c.items || !c.items.length) { container.innerHTML = '<div class="info-box">Sem equipamentos.</div>'; return; }
    const totalVar = c.items.reduce((s, it) => s + (S.items[it.id]?.weight || 0) * (it.qty || 1), 0);
    const totalVal = c.items.reduce((s, it) => s + (S.items[it.id]?.value || 0) * (it.qty || 1), 0);
    container.innerHTML = c.items.map(it => {
        const def = S.items[it.id] || {};
        return `<div class="sheet-item-row">
            <span class="item-emoji">${def.icon || '🎒'}</span>
            <div class="item-name">${def.name || it.id}</div>
            <div class="item-wv">${it.qty || 1}× · ${((def.weight || 0) * (it.qty || 1)).toFixed(1)}kg · ${(def.value || 0) * (it.qty || 1)} PC</div>
            <button class="btn btn-danger" style="padding:5px 10px;font-size:0.75rem" onclick="removeItem('${c.id}','${it.id}')">✕</button>
        </div>`;
    }).join('') + `
        <div class="sheet-item-row" style="justify-content:space-between; margin-top:8px; border-color:var(--gold);">
            <span style="color:var(--gold)">Peso total: <b>${totalVar.toFixed(1)} kg</b></span>
            <span style="color:var(--gold)">Valor total: <b>${totalVal} PC</b></span>
        </div>`;
}
function removeItem(charId, itemId) {
    const c = findChar(charId);
    if (!c) return;
    c.items = c.items.filter(it => it.id !== itemId);
    c.updatedAt = Date.now(); saveCharacters();
    renderSheet(c);
}
function renderSheetInfo(c) {
    $('sheetInfo').innerHTML = `
        <div class="info-row"><span class="info-label">Jogador</span><br>${esc(c.player || '—')}</div>
        <div class="info-row"><span class="info-label">Idade</span><br>${esc(String(c.age))} anos</div>
        <div class="info-row"><span class="info-label">Alinhamento</span><br>${esc(c.alignment)}</div>
        <div class="info-row"><span class="info-label">Origem</span><br>${esc(c.origin || 'Sem história.')}</div>
        <div class="info-row"><span class="info-label">Ouro</span><br>${c.gold ?? 0} PC</div>
    `;
}

/* Tabs da ficha */
function showTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.tabpanel === tab));
}

/* Combate */
function renderCombatLog(msg, type = 'info') {
    const log = $('combatLog');
    const entry = document.createElement('div');
    entry.className = 'combat-entry ' + (type || '');
    entry.textContent = `[${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${msg}`;
    log.prepend(entry);
    while (log.children.length > 30) log.lastChild.remove();
    log.scrollTop = 0;
}
function takeDamage() {
    const c = findChar(currentCharId);
    if (!c) return;
    const dmg = promptDamage('Quanto de dano recebeu?');
    if (dmg == null) return;
    c.hpCur = Math.max(0, c.hpCur - dmg);
    c.updatedAt = Date.now(); saveCharacters();
    renderSheet(c);
    renderLibrary();
    const dead = c.hpCur === 0;
    renderCombatLog(`${c.name} recebeu ${dmg} de dano. (${c.hpCur}/${c.hpMax})${dead ? ' ☠️ INCONSCIENTE!' : ''}`, dead ? 'damage' : 'damage');
    floatFeedback('💔', '-' + dmg);
}
function healCharacter() {
    const c = findChar(currentCharId);
    if (!c) return;
    const amount = promptDamage('Quanto curar?');
    if (amount == null) return;
    const real = Math.min(c.hpMax - c.hpCur, amount);
    c.hpCur += real;
    c.updatedAt = Date.now(); saveCharacters();
    renderSheet(c);
    renderLibrary();
    renderCombatLog(`${c.name} curou ${real} de vida. (${c.hpCur}/${c.hpMax})`, 'heal');
    floatFeedback('💚', '+' + real);
}
function promptDamage(msg) {
    const raw = prompt(msg);
    if (raw === null) return null;
    const n = parseInt(raw, 10);
    if (isNaN(n)) { alertToast('Valor inválido.'); return null; }
    return Math.max(0, n);
}
function rollAttack() {
    const c = findChar(currentCharId);
    if (!c) return;
    const strMod = modFor(c.attrs.forca);
    const prof = 2;
    const bonus = strMod + prof;
    const dice = rollDie(20);
    const total = dice + bonus;
    const crit = dice === 20, fumble = dice === 1;
    const weapon = (c.items && c.items.find(i => S.items[i.id]?.dmg)) || null;
    const wDmg = weapon ? S.items[weapon.id].dmg : '1d4';
    const dmgRoll = rollFormula(wDmg);
    const totalDmg = dmgRoll.total + strMod;
    let msg;
    if (crit) {
        const critDmg = totalDmg * 2;
        msg = `${c.name} acerta CRÍTICO! ${dice} + ${bonus} = ${total}. Dano: ${totalDmg}×2 = ${critDmg} 💥`;
        renderCombatLog(msg, 'crit');
        floatFeedback('⚔️', critDmg + '!');
    } else if (fumble) {
        msg = `${c.name} erra feio! Falha crítica (${dice}).`;
        renderCombatLog(msg, 'damage');
        floatFeedback('💫', 'FALHA!');
    } else {
        msg = `${c.name} ataca: ${dice} + ${bonus} = ${total}. Dano: ${dice === 1 ? '?' : totalDmg}`;
        renderCombatLog(msg, dice >= 15 ? 'heal' : 'info');
        floatFeedback('⚔️', totalDmg);
    }
    addDiceEntry(`${dice}d20 + ${bonus}`, total, crit, 'Ataque ' + c.name);
    playRoll();
}
function rollDamage() {
    const c = findChar(currentCharId);
    if (!c) return;
    const strMod = modFor(c.attrs.forca);
    const weapon = (c.items && c.items.find(i => S.items[i.id]?.dmg)) || null;
    const wDmg = weapon ? S.items[weapon.id].dmg : '1d4';
    const roll = rollFormula(wDmg);
    const total = roll.total + strMod;
    renderCombatLog(`${c.name} rola dano ${wDmg} (${roll.parts.join(' | ')}) + ${strMod} = ${total} 💥`, 'heal');
    floatFeedback('💥', total);
    addDiceEntry(`${wDmg} + ${strMod}`, total, false, 'Dano ' + c.name);
    playRoll();
}
function useSkill(charId, skillId) {
    const c = findChar(charId);
    if (!c) return;
    const sk = S.skills[skillId];
    if (!sk) return;
    if (c.manaCur < sk.cost) { renderCombatLog(`${c.name} MANA insuficiente para ${sk.name} (precisa ${sk.cost}).`, 'damage'); floatFeedback('🔮', 'SEM MANA'); return; }
    c.manaCur -= sk.cost;
    let extra = '';
    if (sk.dmg) {
        const roll = rollFormula(sk.dmg);
        const heal = sk.dmg.startsWith('+');
        if (heal) {
            c.hpCur = Math.min(c.hpMax, c.hpCur + roll.total);
            extra = ` Cura +${roll.total}.`;
            floatFeedback('💚', '+' + roll.total);
        } else {
            extra = ` Dano ${roll.total}.`;
            floatFeedback('💥', roll.total);
        }
    }
    c.updatedAt = Date.now(); saveCharacters();
    renderSheet(c);
    renderCombatLog(`${c.name} usa ${sk.icon} ${sk.name}! Mana -${sk.cost} (${c.manaCur}/${c.manaMax}).${extra}${sk.cd ? ` Recarga ${sk.cd} turno(s).` : ''}`, 'skill');
    renderLibrary();
}

/* Feedback flutuante */
let feedbackTimer = null;
function floatFeedback(icon, text) {
    let el = $('floatFeedback');
    if (!el) {
        el = document.createElement('div');
        el.id = 'floatFeedback';
        el.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-60%) scale(0.6);font-size:3.2rem;z-index:400;pointer-events:none;opacity:0;transition:all 0.45s cubic-bezier(0.3,1.4,0.6,1);font-weight:900;text-shadow:0 0 24px rgba(0,0,0,0.8);text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;';
        document.body.appendChild(el);
    }
    clearTimeout(feedbackTimer);
    el.innerHTML = `<span style="font-size:2.6rem">${icon}</span><span style="color:var(--gold-bright);font-size:2rem">${text}</span>`;
    el.style.opacity = '1'; el.style.transform = 'translate(-50%,-60%) scale(1)';
    feedbackTimer = setTimeout(() => {
        el.style.opacity = '0'; el.style.transform = 'translate(-50%,-60%) scale(0.6)';
    }, 900);
}

/* ---------------------------------------------------------
   8. DADOS
   --------------------------------------------------------- */
function renderDiceGrid() {
    const g = $('diceGrid');
    g.innerHTML = DICE_TYPES.map(d => `
        <button class="dice-btn" id="dice-${d.sides}" onclick="playDice(${d.sides})">
            <span>${d.icon}</span>${d.label}
            <span class="die-sides">${d.sides} lados</span>
        </button>`).join('');
}
function playDice(sides) {
    const el = $('dice-' + sides);
    el.classList.remove('rolling'); void el.offsetWidth; el.classList.add('rolling');
    const res = rollDie(sides);
    setTimeout(() => {
        el.classList.remove('rolling');
        addDiceEntry(`1d${sides}`, res, res === sides && sides === 20, `d${sides}`);
        showRollBanner(`${sides === 20 ? '🈵' : sides === 100 ? '🎱' : '🎲'}`, res, `1d${sides}`);
        playRoll();
    }, 500);
}
function playRoll() {
    const grid = $('diceGrid');
    if (grid) {
        grid.querySelectorAll('.dice-btn').forEach(b => {
            b.classList.remove('rolling'); void b.offsetWidth; b.classList.add('rolling');
        });
    }
}
function rollCustom() {
    const input = $('customRollInput').value.trim();
    if (!input) return;
    // valida formato
    if (!/^(\d*d\d+|\d+)(\s*[+-]\s*(\d*d\d+|\d+))*$/i.test(input.replace(/\s/g, '')) ) {
        alertToast('Formato inválido. Ex: 2d6 + 3, 1d20, 4d4');
        return;
    }
    const roll = rollFormula(input);
    addDiceEntry(input, roll.total, false, 'Personalizado');
    showRollBanner('🎲', roll.total, input);
    playRoll();
}
function addDiceEntry(label, value, crit, category) {
    diceHistory.unshift({ label, value, crit: !!crit, category, time: Date.now(), formula: label });
    saveDiceHistory();
    renderDiceHistory();
}
function renderDiceHistory() {
    const container = $('diceHistory');
    if (!diceHistory.length) { container.innerHTML = '<div class="info-box">Nenhuma rolagem ainda. Role um dado!</div>'; return; }
    container.innerHTML = diceHistory.map(h => `
        <div class="dice-history-entry">
            <div>
                <div class="history-formula">${esc(h.label)}${h.category ? ` <span style="opacity:0.6">· ${esc(h.category)}</span>` : ''}</div>
                <div class="history-time">${new Date(h.time).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div class="history-result ${h.crit ? 'crit' : ''}">${h.value}</div>
        </div>`).join('');
}
function showRollBanner(icon, value, label) {
    let b = $('rollBanner');
    if (!b) {
        b = document.createElement('div');
        b.className = 'roll-banner';
        b.id = 'rollBanner';
        document.body.appendChild(b);
    }
    b.innerHTML = `<div class="roll-icon">${icon}</div><div class="roll-value">${value}</div><div class="roll-label">${esc(label)}</div>`;
    b.classList.add('show');
    setTimeout(() => b.classList.remove('show'), 1400);
}

/* ---------------------------------------------------------
   9. TOASTS
   --------------------------------------------------------- */
let toastTimer = null;
function alertToast(msg) {
    let t = $('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translate(-50%,20px);background:linear-gradient(180deg,var(--wine-dark),var(--bg-deep));border:1px solid var(--gold);color:var(--text-light);padding:12px 22px;border-radius:10px;font-size:0.92rem;z-index:500;opacity:0;transition:all 0.3s ease;box-shadow:var(--shadow-gold);max-width:90vw;text-align:center;';
        document.body.appendChild(t);
    }
    clearTimeout(toastTimer);
    t.textContent = msg;
    t.style.opacity = '1'; t.style.transform = 'translate(-50%,0)';
    toastTimer = setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%,20px)'; }, 2200);
}

/* ---------------------------------------------------------
   10. MODAIS DE CONFIRMAÇÃO
   --------------------------------------------------------- */
let confirmCallback = null;
function showConfirm(title, msg, cb) {
    $('confirmTitle').textContent = title;
    $('confirmMsg').textContent = msg;
    confirmCallback = cb;
    $('confirmModal').classList.add('show');
}
function closeConfirm() { $('confirmModal').classList.remove('show'); confirmCallback = null; }
function closeEditModal() { $('editModal').classList.remove('show'); editTarget = null; }
document.addEventListener('DOMContentLoaded', () => {
    $('confirmAction').onclick = () => { if (confirmCallback) confirmCallback(); closeConfirm(); };
    $('confirmModal').addEventListener('click', e => { if (e.target === $('confirmModal')) closeConfirm(); });
    $('editModal').addEventListener('click', e => { if (e.target === $('editModal')) closeEditModal(); });
    $('creatureModal').addEventListener('click', e => { if (e.target === $('creatureModal')) closeCreatureModal(); });
    $('actionModal').addEventListener('click', e => { if (e.target === $('actionModal')) closeActionModal(); });
    $('targetModal').addEventListener('click', e => { if (e.target === $('targetModal')) closeTargetModal(); });
    $('editValueInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveEditValue(); });
});

/* ---------------------------------------------------------
   11. EXPORTAÇÃO / IMPORTAÇÃO / PDF
   --------------------------------------------------------- */
function exportCharacterJSON() {
    const c = findChar(currentCharId);
    if (!c) return;
    downloadJSON(c, c.name + '.json');
}
function exportAllJSON() {
    const data = { app: 'Aetheria', exportedAt: new Date().toISOString(), characters };
    downloadJSON(data, 'aetheria-fichas.json');
}
function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
}
function exportCharacterPDF() {
    const c = findChar(currentCharId);
    if (!c) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${c.name} - Ficha</title><style>body{font-family:Georgia,serif;background:#f5ecd7;color:#2a1a0a;padding:30px;}h1{color:#6b3d1a;border-bottom:2px solid #a07020;}table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #a07020;padding:8px;text-align:left}th{background:#e8d5a8}</style></head><body>
        <h1>${esc(c.name)} — Ficha de Personagem</h1>
        <p><b>Classe:</b> ${esc(c.className)} · <b>Nível:</b> ${c.level} · <b>Alinhamento:</b> ${esc(c.alignment)} · <b>Jogador:</b> ${esc(c.player)}</p>
        <h3>Atributos</h3>
        <table><tr><th>Atributo</th><th>Valor</th><th>Mod</th></tr>
        ${ATTR_ORDER.map(a => `<tr><td>${ATTR_LABELS[a]}</td><td>${c.attrs[a]}</td><td>${fmtMod(modFor(c.attrs[a]))}</td></tr>`).join('')}</table>
        <h3>Vida e Mana</h3><p>PV: ${c.hpCur}/${c.hpMax} · Mana: ${c.manaCur}/${c.manaMax} · XP: ${c.xp}</p>
        <h3>Habilidades</h3><ul>${(c.skills || []).map(id => `<li>${S.skills[id]?.icon || ''} ${S.skills[id]?.name || id}</li>`).join('') || '<li>Nenhuma</li>'}</ul>
        <h3>Equipamentos</h3><ul>${(c.items || []).map(i => `<li>${S.items[i.id]?.icon || ''} ${S.items[i.id]?.name || i.id} (x${i.qty || 1})</li>`).join('') || '<li>Vazio</li>'}</ul>
        <h3>História</h3><p>${esc(c.origin || '—')}</p>
        <p style="margin-top:40px;text-align:center;color:#999">Gerado por Aetheria</p>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 200);
}

/* ---------------------------------------------------------
   12. CONFIGURAÇÕES
   --------------------------------------------------------- */
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    alertToast('Tema alternado.');
}
function resetAllData() {
    showConfirm('Limpar todos os dados?', 'Todas as fichas e o histórico de dados serão apagados permanentemente.', () => {
        characters = []; diceHistory = [];
        combat = { creatures: [], players: [] };
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('aetheria_dice_history');
        localStorage.removeItem(COMBAT_KEY);
        saveCharacters();
        currentCharId = null;
        goTo('home');
        renderLibrary();
        alertToast('Dados limpos.');
    });
}

/* ---------------------------------------------------------
   13. DADOS DE EXEMPLO
   --------------------------------------------------------- */
function seedExampleData() {
    if (characters.length) return;
    const sample = [
        {
            name: 'Sir Aldric', player: 'Mestre', age: 34, alignment: 'Leal e Bom', level: 3, xp: 250,
            origin: 'Cavaleiro da Ordem do Sol Nascente, jurou proteger o reino das trevas que espreitam além das fronteiras.',
            race: 'Humano', className: 'Paladino', classId: 'paladino', portrait: '🛡️',
            attrs: { forca: 16, destreza: 10, constituicao: 14, inteligencia: 10, sabedoria: 12, carisma: 14 },
            hpMax: 34, hpCur: 34, manaMax: 15, manaCur: 15,
            skills: ['golpe-sagrado', 'aura-de-protecao', 'julgamento', 'cura-imposicao'],
            items: [{ id: 'espada-longa', qty: 1 }, { id: 'placa-completa', qty: 1 }, { id: 'escudo-de-ferro', qty: 1 }, { id: 'pocao-de-cura', qty: 2 }],
            gold: 150
        },
        {
            name: 'Mira Sombria', player: 'Mestre', age: 27, alignment: 'Caótico e Neutro', level: 4, xp: 420,
            origin: 'Ladra das vielas de Portonégro. Sobrevive com agilidade e furtividade, caçando tesouros esquecidos.',
            race: 'Elfa', className: 'Ladino', classId: 'ladino', portrait: '🗡️',
            attrs: { forca: 10, destreza: 18, constituicao: 12, inteligencia: 14, sabedoria: 10, carisma: 12 },
            hpMax: 34, hpCur: 34, manaMax: 16, manaCur: 16,
            skills: ['ataque-furtivo', 'esquiva-agil', 'veneno', 'sombra'],
            items: [{ id: 'adaga', qty: 2 }, { id: 'armadura-de-coura', qty: 1 }, { id: 'pocao-de-cura', qty: 1 }, { id: 'corda', qty: 1 }],
            gold: 300
        },
        {
            name: 'Zorath', player: 'Mestre', age: 120, alignment: 'Neutro Bom', level: 5, xp: 800,
            origin: 'Mago estudioso que abandonou a torre arcanal para proteger a natureza e os segredos antigos.',
            race: 'Elfo', className: 'Mago', classId: 'mago', portrait: '🔮',
            attrs: { forca: 8, destreza: 14, constituicao: 12, inteligencia: 18, sabedoria: 13, carisma: 10 },
            hpMax: 36, hpCur: 36, manaMax: 40, manaCur: 40,
            skills: ['bala-de-fogo', 'escudo-arcano', 'relampago', 'nevasca'],
            items: [{ id: 'cajado-arcano', qty: 1 }, { id: 'manto-de-mago', qty: 1 }, { id: 'pocao-de-mana', qty: 2 }, { id: 'anel-de-protecao', qty: 1 }],
            gold: 800
        }
    ];
    sample.forEach(s => { s.id = uid(); s.createdAt = Date.now(); s.updatedAt = Date.now(); characters.push(s); });
    saveCharacters();
}

/* ---------------------------------------------------------
   14. CRIATURAS E COMBATE
   --------------------------------------------------------- */

const CREATURES_BASE = [
    {
        id: 'goblin', name: 'Goblin', icon: '👺', level: 1, hpMax: 14, defense: 13, attack: 3, damage: '1d6',
        description: 'Pequena criatura cruel e covarde. Habita cavernas e florestas escuras, atacando em bandos com facas e arcos curtos.',
        skills: [
            { name: 'Arremesso de Faca', icon: '🔪', cat: 'Ataque', dmg: '1d6', desc: 'Ataque à distância. Causa 1d6 de dano.' },
            { name: 'Esquiva Veloz', icon: '💨', cat: 'Defesa', dmg: null, desc: 'Esquiva-se com facilidade de ataques diretos.' }
        ],
        weaknesses: ['Luz'], resistances: ['Nenhuma']
    },
    {
        id: 'orc', name: 'Orc', icon: '👹', level: 3, hpMax: 32, defense: 14, attack: 6, damage: '2d8',
        description: 'Guerreiro bruto e musculoso. Lidera bandos, entra em fúria quando ferido e golpeia sem piedade.',
        skills: [
            { name: 'Investida Brutal', icon: '💥', cat: 'Ataque', dmg: '2d4', desc: 'Avança sobre o alvo. Causa 2d4 de dano extra.' },
            { name: 'Fúria de Batalha', icon: '😡', cat: 'Defesa', dmg: null, desc: 'Em fúria, reduz pela metade o dano de corte.' }
        ],
        weaknesses: ['Nenhuma'], resistances: ['Corte']
    },
    {
        id: 'esqueleto', name: 'Esqueleto', icon: '💀', level: 2, hpMax: 20, defense: 12, attack: 4, damage: '1d8',
        description: 'Restos animados por necromancia. Marcham lentamente contra os vivos, implacáveis e silenciosos.',
        skills: [
            { name: 'Golpe de Espada', icon: '🗡️', cat: 'Ataque', dmg: '1d8', desc: 'Ataque com a espada enferrujada. Causa 1d8 de dano.' }
        ],
        weaknesses: ['Contundente', 'Sagrado'], resistances: ['Corte', 'Veneno']
    },
    {
        id: 'lobo', name: 'Lobo', icon: '🐺', level: 2, hpMax: 22, defense: 13, attack: 5, damage: '1d10',
        description: 'Predador das florestas, caça em alcateias. Rápido, furtivo e letal quando age em bando.',
        skills: [
            { name: 'Mordida', icon: '🦷', cat: 'Ataque', dmg: '1d10', desc: 'Mordida forte. Causa 1d10 de dano.' },
            { name: 'Uivo', icon: '🌕', cat: 'Suporte', dmg: null, desc: 'Convoca lobos das redondezas para o combate.' }
        ],
        weaknesses: ['Fogo'], resistances: ['Nenhuma']
    },
    {
        id: 'dragao', name: 'Dragão Vermelho', icon: '🐲', level: 10, hpMax: 120, defense: 18, attack: 12, damage: '3d10',
        description: 'Aterrorizante senhor dos céus. Cospe fogo e voa sobre o campo de batalha, devastando tudo com suas garras colossais.',
        skills: [
            { name: 'Sopro de Fogo', icon: '🔥', cat: 'Ataque', dmg: '6d8', desc: 'Exala uma coluna de chamas. Causa 6d8 de dano em área.' },
            { name: 'Garra Colossal', icon: '🐾', cat: 'Ataque', dmg: '2d10+4', desc: 'Golpe duplo de garras. Causa 2d10+4 de dano.' },
            { name: 'Voo', icon: '🪽', cat: 'Defesa', dmg: null, desc: 'Alça voo e percorre longas distâncias sem ser atingido.' }
        ],
        weaknesses: ['Nenhuma'], resistances: ['Fogo', 'Frio', 'Eletricidade']
    }
];

const COMBAT_KEY = 'aetheria_combat_v1';
let combat = loadCombat();
let modalQtyValue = 1;

function loadCombat() {
    try {
        const raw = localStorage.getItem(COMBAT_KEY);
        const saved = raw ? JSON.parse(raw) : {};
        return { creatures: saved.creatures || [], players: saved.players || [], history: saved.history || [] };
    } catch { return { creatures: [], players: [], history: [] }; }
}
function saveCombat() {
    try { localStorage.setItem(COMBAT_KEY, JSON.stringify(combat)); } catch {}
}
function creatureById(id) { return CREATURES_BASE.find(x => x.id === id); }

/* Lista de criaturas */
function renderCreatureList() {
    const grid = $('creatureList');
    if (!grid) return;
    grid.innerHTML = CREATURES_BASE.map(c => `
        <div class="creature-card">
            <div class="creature-card-top">
                <div class="creature-avatar">${c.icon}</div>
                <div>
                    <div class="creature-name">${esc(c.name)}</div>
                    <div class="creature-level">⭐ Nível ${c.level}</div>
                </div>
            </div>
            <div class="creature-card-body">
                <div class="char-stat-line"><span>❤️ Vida</span><b>${c.hpMax}</b></div>
                <div class="char-stat-line"><span>🛡️ Defesa</span><b>${c.defense}</b></div>
                <div class="char-stat-line"><span>⚔️ Ataque</span><b>+${c.attack} · ${esc(c.damage)}</b></div>
                <div class="creature-desc">${esc(c.description)}</div>
            </div>
            <div class="creature-card-actions">
                <button class="btn btn-gold btn-sm" onclick="openCreatureDetails('${c.id}')">👁 Ver detalhes</button>
                <button class="btn btn-secondary btn-sm" onclick="addToCombat('${c.id}', 1)">⚔️ Adicionar</button>
            </div>
        </div>`).join('');
}

/* Detalhes */
function openCreatureDetails(id) {
    const c = creatureById(id);
    if (!c) return;
    modalQtyValue = 1;
    $('creatureDetail').innerHTML = `
        <div class="creature-detail-head">
            <div class="creature-detail-icon">${c.icon}</div>
            <div>
                <div class="creature-name">${esc(c.name)}</div>
                <div class="creature-level">⭐ Nível ${c.level}</div>
            </div>
        </div>
        <p class="creature-desc-full">${esc(c.description)}</p>
        <div class="creature-stats">
            <div class="creature-stat"><span>❤️ Vida</span><b>${c.hpMax}</b></div>
            <div class="creature-stat"><span>🛡️ Defesa</span><b>${c.defense}</b></div>
            <div class="creature-stat"><span>⚔️ Ataque</span><b>+${c.attack}</b></div>
            <div class="creature-stat"><span>💥 Dano</span><b>${esc(c.damage)}</b></div>
        </div>
        <div class="creature-section-title">✨ Habilidades</div>
        <div class="creature-skills">
            ${c.skills.map(s => `<div class="creature-skill">
                <span>${s.icon}</span>
                <div>
                    <div class="creature-skill-name">${esc(s.name)}</div>
                    <div class="creature-skill-desc">${esc(s.desc)}</div>
                </div>
            </div>`).join('')}
        </div>
        <div class="creature-vuln">
            <div class="creature-res-row"><span>⚠️ Fraquezas:</span> <i>${esc(c.weaknesses.join(', '))}</i></div>
            <div class="creature-res-row"><span>🛡️ Resistências:</span> <i>${esc(c.resistances.join(', '))}</i></div>
        </div>
        <div class="creature-qty-row">
            <span class="creature-qty-label">Quantidade:</span>
            <button class="attr-btn" onclick="modalQty(-1)">−</button>
            <span id="modalQty" class="attr-num">1</span>
            <button class="attr-btn" onclick="modalQty(1)">+</button>
        </div>
        <div class="modal-actions" style="margin-top:16px">
            <button class="btn btn-secondary" onclick="closeCreatureModal()">Fechar</button>
            <button class="btn btn-primary" id="creatureAddBtn" onclick="addToCombat('${c.id}')">⚔️ Adicionar ao combate</button>
        </div>`;
    $('creatureModal').classList.add('show');
}
function modalQty(d) {
    modalQtyValue = Math.max(1, Math.min(10, modalQtyValue + d));
    const el = $('modalQty'); if (el) el.textContent = modalQtyValue;
    const btn = $('creatureAddBtn'); if (btn) btn.textContent = `⚔️ Adicionar ao combate (×${modalQtyValue})`;
}
function closeCreatureModal() { $('creatureModal').classList.remove('show'); }

/* Adicionar criaturas ao combate */
function addToCombat(id, qty) {
    const c = creatureById(id);
    if (!c) return;
    const n = qty || modalQtyValue || 1;
    for (let i = 0; i < n; i++) combat.creatures.push({ uid: uid(), creatureId: id, hpCur: c.hpMax });
    addCombatLog(`${n > 1 ? n + '× ' : ''}${c.name} entrou no combate (${c.hpMax} HP).`, 'info');
    saveCombat();
    closeCreatureModal();
    renderCombat();
    renderPlayerPicker();
    alertToast(`⚔️ ${n > 1 ? n + '× ' : ''}${c.name} adicionado(s) ao combate!`);
}

/* Jogadores do encontro */
function renderPlayerPicker() {
    const container = $('playerPicker');
    if (!container) return;
    if (!characters.length) {
        container.innerHTML = '<div class="info-box">Nenhum personagem criado ainda. Crie personagens na aba "Criar Personagem".</div>';
        return;
    }
    container.innerHTML = characters.map(c => {
        const active = combat.players.includes(c.id);
        return `<div class="player-pick ${active ? 'active' : ''}" onclick="togglePlayerInCombat('${c.id}')">
            <span class="player-pick-icon">${esc(c.portrait || '🧙')}</span>
            <div class="player-pick-info">
                <div class="player-pick-name">${esc(c.name)}</div>
                <div class="player-pick-sub">${esc(c.className || '')} · Nível ${c.level} · ❤️ ${c.hpCur}/${c.hpMax}</div>
            </div>
            <span class="player-pick-check">${active ? '✔' : ''}</span>
        </div>`;
    }).join('');
}
function togglePlayerInCombat(charId) {
    const i = combat.players.indexOf(charId);
    if (i >= 0) combat.players.splice(i, 1);
    else combat.players.push(charId);
    saveCombat();
    renderCombat();
    renderPlayerPicker();
}

/* Combate atual — modelo unificado de combatentes */
function charDefense(c) {
    let armor = 0, bonus = 0;
    (c.items || []).forEach(it => {
        const def = S.items[it.id]?.def || 0;
        const cat = S.items[it.id]?.cat;
        if (cat === 'armaduras') armor = Math.max(armor, def);
        else if (cat === 'escudos' || cat === 'magicos') bonus += def;
    });
    return (armor || 10) + bonus;
}
function weaponDamageOf(c) {
    const w = (c.items || []).find(i => S.items[i.id]?.dmg);
    return w ? S.items[w.id].dmg : '1d4';
}
function getCombatants() {
    const list = [];
    combat.players.forEach(id => {
        const c = findChar(id);
        if (!c) return;
        list.push({
            kind: 'char', ref: id, name: c.name, icon: c.portrait || '🧙',
            sub: `${c.className || 'Personagem'} · Nível ${c.level}`,
            hpCur: c.hpCur, hpMax: c.hpMax,
            defense: charDefense(c), attack: modFor(c.attrs.forca) + 2,
            manaCur: c.manaCur, manaMax: c.manaMax, hasMana: c.manaMax > 0,
            side: 'players', alive: c.hpCur > 0
        });
    });
    combat.creatures.forEach(e => {
        const c = creatureById(e.creatureId);
        if (!c) return;
        list.push({
            kind: 'creature', ref: e.uid, creatureId: e.creatureId, name: c.name, icon: c.icon,
            sub: `Criatura · Nível ${c.level}`,
            hpCur: e.hpCur, hpMax: c.hpMax,
            defense: c.defense, attack: c.attack,
            manaCur: 0, manaMax: 0, hasMana: false,
            side: 'enemies', alive: e.hpCur > 0
        });
    });
    return list;
}
function cbtById(ref) { return getCombatants().find(x => x.ref === ref) || null; }
function actionRule(a) {
    if (a.dmg && a.dmg.startsWith('+')) return 'heal';
    if (a.dmg) return 'damage';
    return 'utility';
}
function combatantActions(cbt) {
    const actions = [];
    if (cbt.kind === 'char') {
        const c = findChar(cbt.ref);
        if (!c) return actions;
        actions.push({ id: 'basic__' + cbt.ref, name: 'Ataque Básico', icon: '⚔️', cat: 'Ataque', dmg: weaponDamageOf(c), cost: 0, desc: 'Ataque com a arma equipada.' });
        (c.skills || []).forEach(sid => {
            const sk = S.skills[sid];
            if (!sk) return;
            actions.push({
                id: 'skill__' + sid, skillId: sid, name: sk.name, icon: sk.icon || '✨',
                cat: sk.cat || 'Ataque', dmg: sk.dmg || null, cost: sk.cost || 0,
                cd: sk.cd || 0, desc: sk.desc || ''
            });
        });
    } else {
        const e = combat.creatures.find(x => x.uid === cbt.ref);
        const c = e ? creatureById(e.creatureId) : null;
        if (!c) return actions;
        actions.push({ id: 'basic__' + cbt.ref, name: 'Ataque Básico', icon: '⚔️', cat: 'Ataque', dmg: c.damage, cost: 0, desc: 'Ataque natural da criatura.' });
        (c.skills || []).forEach((sk, i) => {
            actions.push({
                id: 'cskill__' + c.id + '__' + i, name: sk.name, icon: sk.icon || '✨',
                cat: sk.cat || 'Ataque', dmg: sk.dmg || null, cost: sk.cost || 0, desc: sk.desc || ''
            });
        });
    }
    return actions;
}
function validTargets(actor, action) {
    const rule = actionRule(action);
    const all = getCombatants();
    if (rule === 'heal') return all.filter(t => t.side === actor.side && t.alive && t.hpCur < t.hpMax);
    if (rule === 'damage') return all.filter(t => t.side !== actor.side && t.alive);
    return all.filter(t => t.ref === actor.ref);
}
function renderCombat() {
    const area = $('combatArea');
    if (!area) return;
    const list = getCombatants();
    if (!list.length) {
        area.innerHTML = `<div class="empty-state" style="margin:0">
            <div class="empty-icon">⚔️</div>
            <h3>Nenhum combatente ainda</h3>
            <p>Adicione criaturas abaixo e selecione os personagens do encontro. Clique em um combatente para abrir suas ações.</p>
        </div>`;
        renderCombatHistory();
        return;
    }
    area.innerHTML = `<div class="combat-grid">${list.map(combatantTile).join('')}</div>`;
    renderCombatHistory();
}
function combatantTile(x) {
    const pct = Math.max(0, Math.min(100, (x.hpCur / x.hpMax) * 100));
    const dead = !x.alive;
    const count = x.kind === 'creature' ? combat.creatures.filter(e => e.creatureId === x.creatureId).length : 0;
    return `<div class="combat-tile ${dead ? 'defeated' : ''} ${x.kind === 'char' ? 'combat-player-tile' : ''}" onclick="openActionPanel('${x.ref}')" title="${dead ? 'Derrotado — clique para ver opções' : 'Clique para abrir as ações'}">
        <div class="combat-tile-head">
            <span class="combat-creature-icon">${x.icon}</span>
            <div class="combat-creature-info">
                <span class="combat-creature-name">${esc(x.name)}${count > 1 ? ` <span class="combat-count">×${count}</span>` : ''}${dead ? ' <span class="combat-badge dead-badge">☠ Derrotado</span>' : ''}</span>
                <span class="combat-creature-sub">${esc(x.sub)} · ${x.kind === 'char' ? 'Personagem' : 'Criatura'}</span>
            </div>
        </div>
        <div class="combat-hp-row">
            <span>❤️</span>
            <div class="bar"><div class="bar-fill hp" style="width:${pct}%"></div></div>
            <b class="${dead ? 'combat-dead' : ''}">${x.hpCur}/${x.hpMax}</b>
        </div>
        <div class="combat-stats-line">
            <span>🛡️ ${x.defense}</span>
            <span>⚔️ +${x.attack}</span>
            ${x.hasMana ? `<span>🔮 ${x.manaCur}/${x.manaMax}</span>` : ''}
        </div>
        <div class="combat-tile-actions" onclick="event.stopPropagation()">
            <button class="btn btn-primary btn-xs" onclick="openActionPanel('${x.ref}')">⚔️ Ações</button>
            <button class="btn btn-danger btn-xs" onclick="quickDamage('${x.ref}')" title="Aplicar dano manualmente">💔</button>
            <button class="btn btn-success btn-xs" onclick="quickHeal('${x.ref}')" title="Curar manualmente">💚</button>
            <button class="btn btn-secondary btn-xs" onclick="quickRestore('${x.ref}')" title="Restaurar / reviver">♻</button>
            <button class="btn btn-danger btn-xs" onclick="removeCombatant('${x.ref}')" title="Remover do combate">✕</button>
        </div>
    </div>`;
}
function addCombatLog(text, type = 'info') {
    combat.history = combat.history || [];
    combat.history.unshift({ time: Date.now(), text, type });
    if (combat.history.length > 200) combat.history.length = 200;
}
function renderCombatHistory() {
    const box = $('combatHistory');
    if (!box) return;
    if (!combat.history || !combat.history.length) {
        box.innerHTML = '<div class="info-box">Nenhuma ação registrada ainda.</div>';
        return;
    }
    box.innerHTML = combat.history.map(h => {
        const t = new Date(h.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `<div class="combat-log-entry ${h.type}"><span class="combat-log-time">${t}</span>${esc(h.text)}</div>`;
    }).join('');
}

/* Controle de HP (manual) */
function setCombatantHp(ref, kind, value) {
    if (kind === 'char') {
        const c = findChar(ref);
        if (!c) return;
        c.hpCur = value; c.updatedAt = Date.now();
    } else {
        const e = combat.creatures.find(x => x.uid === ref);
        if (!e) return;
        e.hpCur = value;
    }
}
function quickDamage(ref) {
    const x = cbtById(ref);
    if (!x) return;
    const dmg = promptDamage(`Quanto de dano ${x.name} recebeu?`);
    if (dmg == null) return;
    const before = x.hpCur;
    const after = Math.max(0, before - dmg);
    setCombatantHp(ref, x.kind, after);
    addCombatLog(`${x.name} sofreu ${dmg} de dano. ${x.name}: ${before}/${x.hpMax} → ${after}/${x.hpMax} HP.`, 'damage');
    if (after <= 0 && before > 0) addCombatLog(`💀 ${x.name} foi derrotado.`, 'damage');
    saveCombat(); saveCharacters();
    floatFeedback(after <= 0 ? '💀' : '💔', '-' + dmg);
    renderCombat(); renderPlayerPicker();
    alertToast(`${x.name}: ${after}/${x.hpMax} HP${after <= 0 ? ' — derrotado!' : ''}`);
}
function quickHeal(ref) {
    const x = cbtById(ref);
    if (!x) return;
    const amt = promptDamage(`Quanto curar ${x.name}?`);
    if (amt == null) return;
    const before = x.hpCur;
    const after = Math.min(x.hpMax, before + amt);
    const real = after - before;
    setCombatantHp(ref, x.kind, after);
    addCombatLog(`${x.name} recuperou ${real} de vida. ${x.name}: ${before}/${x.hpMax} → ${after}/${x.hpMax} HP.`, 'heal');
    saveCombat(); saveCharacters();
    floatFeedback('💚', '+' + real);
    renderCombat(); renderPlayerPicker();
    alertToast(`${x.name}: ${after}/${x.hpMax} HP`);
}
function quickRestore(ref) {
    const x = cbtById(ref);
    if (!x) return;
    const wasDead = !x.alive;
    setCombatantHp(ref, x.kind, x.hpMax);
    addCombatLog(`${wasDead ? '✨ ' + x.name + ' foi revivido' : '♻ ' + x.name + ' foi restaurado'} para ${x.hpMax}/${x.hpMax} HP.`, 'heal');
    saveCombat(); saveCharacters();
    renderCombat(); renderPlayerPicker();
    alertToast(`♻ ${x.name} restaurado para ${x.hpMax} HP.`);
}
function removeCombatant(ref) {
    const x = cbtById(ref);
    if (!x) return;
    if (x.kind === 'char') {
        const i = combat.players.indexOf(ref);
        if (i >= 0) combat.players.splice(i, 1);
    } else {
        combat.creatures = combat.creatures.filter(e => e.uid !== ref);
    }
    addCombatLog(`${x.name} saiu do combate.`, 'info');
    saveCombat();
    renderCombat(); renderPlayerPicker();
    alertToast(`${x.name} removido do combate.`);
}
function removeFromCombat(uid) { removeCombatant(uid); }
function removePlayerFromCombat(charId) { removeCombatant(charId); }

/* Painel de ações do combatente */
let combatActorRef = null;
let pendingAction = null;

function openActionPanel(ref) {
    const actor = cbtById(ref);
    if (!actor) return;
    combatActorRef = ref;
    const actions = combatantActions(actor);
    $('actionPanel').innerHTML = `
        <div class="action-head">
            <div class="action-icon">${actor.icon}</div>
            <div>
                <div class="action-name">${esc(actor.name)}</div>
                <div class="action-sub">${esc(actor.sub)} · ${actor.kind === 'char' ? 'Personagem' : 'Criatura'}</div>
                <div class="action-stats">
                    <span>❤️ ${actor.hpCur}/${actor.hpMax}</span>
                    <span>🛡️ Def ${actor.defense}</span>
                    <span>⚔️ Ataque +${actor.attack}</span>
                    ${actor.hasMana ? `<span>🔮 ${actor.manaCur}/${actor.manaMax}</span>` : ''}
                    <span>${actor.alive ? '🟢 Normal' : '☠ Derrotado'}</span>
                </div>
            </div>
        </div>
        <div class="action-list-title">Ações</div>
        <div class="action-list">
            ${actions.map(a => {
                const rule = actionRule(a);
                const canUse = (!a.cost) || (actor.hasMana && actor.manaCur >= a.cost);
                const btnLabel = rule === 'damage' ? '⚔️ Atacar' : rule === 'heal' ? '💚 Curar' : '✨ Usar';
                return `<div class="action-row">
                    <div class="action-main">
                        <span class="action-icon">${a.icon}</span>
                        <div class="action-info">
                            <div class="action-name2">${esc(a.name)}</div>
                            <div class="action-meta">
                                ${rule === 'damage' ? `<span class="skill-tag damage">💥 ${esc(a.dmg)}</span>` : ''}
                                ${rule === 'heal' ? `<span class="skill-tag heal">💚 ${esc(a.dmg)}</span>` : ''}
                                ${a.cost ? `<span class="skill-tag cost">🔮 ${a.cost} Mana</span>` : ''}
                                ${rule === 'utility' ? '<span class="skill-tag cooldown">✨ Efeito</span>' : ''}
                            </div>
                            <div class="action-desc">${esc(a.desc)}</div>
                        </div>
                        <button class="btn btn-primary btn-xs" ${canUse ? '' : 'disabled'} title="${canUse ? '' : 'Recurso insuficiente'}" onclick="useAction('${a.id}')">${btnLabel}</button>
                    </div>
                </div>`;
            }).join('')}
        </div>
        <div class="modal-actions" style="margin-top:14px">
            <button class="btn btn-secondary" onclick="closeActionModal()">Fechar</button>
        </div>`;
    $('actionModal').classList.add('show');
}
function closeActionModal() { $('actionModal').classList.remove('show'); combatActorRef = null; pendingAction = null; }

function useAction(actionId) {
    const actor = cbtById(combatActorRef);
    if (!actor) return;
    if (!actor.alive) { alertToast(`${actor.name} está derrotado e não pode agir.`); return; }
    const action = combatantActions(actor).find(a => a.id === actionId);
    if (!action) return;
    if (action.cost) {
        if (!actor.hasMana) { alertToast(`Requer ${action.cost} de Mana (sem recurso disponível).`); return; }
        if (actor.manaCur < action.cost) { alertToast(`Mana insuficiente (precisa ${action.cost}).`); return; }
    }
    const rule = actionRule(action);
    if (rule === 'utility') { executeCombatAction(actor, actor, action); return; }
    const targets = validTargets(actor, action);
    if (!targets.length) {
        alertToast(rule === 'heal' ? 'Nenhum aliado ferido para curar.' : 'Nenhum alvo inimigo disponível.');
        return;
    }
    if (rule === 'heal' && targets.length === 1 && targets[0].ref === actor.ref) {
        executeCombatAction(actor, actor, action);
        return;
    }
    pendingAction = { actorRef: combatActorRef, actionId };
    showTargetPicker(rule === 'heal' ? 'Escolha quem receberá a cura' : 'Escolha um alvo para o ataque', targets);
}

function showTargetPicker(title, targets) {
    $('targetTitle').textContent = title;
    $('targetList').innerHTML = targets.map(t => {
        const pct = Math.max(0, Math.min(100, (t.hpCur / t.hpMax) * 100));
        return `<div class="target-row" onclick="pickTarget('${t.ref}')">
            <span class="target-icon">${t.icon}</span>
            <div class="target-info">
                <div class="target-name">${esc(t.name)}<span class="target-type">${t.kind === 'char' ? 'Personagem' : 'Criatura'}</span></div>
                <div class="target-hp-row">
                    <span>❤️</span>
                    <div class="bar"><div class="bar-fill hp" style="width:${pct}%"></div></div>
                    <b>${t.hpCur}/${t.hpMax}</b>
                </div>
            </div>
        </div>`;
    }).join('') || '<div class="info-box">Nenhum alvo disponível.</div>';
    $('targetModal').classList.add('show');
}
function pickTarget(ref) {
    const target = cbtById(ref);
    $('targetModal').classList.remove('show');
    if (!target || !pendingAction) { pendingAction = null; return; }
    const actorRef = pendingAction.actorRef;
    const actor = cbtById(actorRef);
    const action = actor ? combatantActions(actor).find(a => a.id === pendingAction.actionId) : null;
    pendingAction = null;
    if (actor && action) {
        combatActorRef = actorRef;
        executeCombatAction(actor, target, action);
    }
}
function closeTargetModal() { $('targetModal').classList.remove('show'); pendingAction = null; }

/* Execução da ação */
function executeCombatAction(actor, target, action) {
    const rule = actionRule(action);
    if (action.cost && actor.kind === 'char') {
        const ch = findChar(actor.ref);
        if (ch) { ch.manaCur = Math.max(0, ch.manaCur - action.cost); ch.updatedAt = Date.now(); }
        actor.manaCur = Math.max(0, actor.manaCur - action.cost);
    }
    const costNote = (action.cost && actor.kind === 'char') ? ` Mana -${action.cost} (${actor.manaCur}/${actor.manaMax}).` : '';

    if (rule === 'damage') {
        const isBasic = action.id.indexOf('basic__') === 0;
        let dmg = 0, rollNote = '', attackNote = '', crit = false;
        if (isBasic) {
            const d = rollDie(20);
            const toHit = d + actor.attack;
            crit = d === 20;
            const miss = d === 1;
            const base = rollFormula(action.dmg);
            const ch = actor.kind === 'char' ? findChar(actor.ref) : null;
            const extra = ch ? modFor(ch.attrs.forca) : 0;
            const raw = base.total + extra;
            dmg = miss ? 0 : (crit ? raw * 2 : raw);
            rollNote = `${action.dmg}${extra ? ' + ' + extra : ''} = ${raw}` + (crit ? ` ×2 = ${raw * 2}` : '');
            attackNote = `Rolagem de ataque: d20 (${d}) + ${actor.attack} = ${toHit}${miss ? ' — falha crítica!' : crit ? ' — CRÍTICO!' : ''}.`;
        } else {
            const base = rollFormula(action.dmg);
            dmg = base.total;
            rollNote = `${action.dmg} = ${dmg}`;
        }
        const before = target.hpCur;
        const after = Math.max(0, before - dmg);
        setCombatantHp(target.ref, target.kind, after);
        const died = before > 0 && after === 0;
        addCombatLog(`${actor.name} usou ${action.icon} ${action.name} em ${target.name}.${costNote}`, 'skill');
        if (attackNote) addCombatLog(attackNote, 'info');
        addCombatLog(`Rolagem: ${rollNote}. Dano causado: ${dmg}.`, crit && dmg > 0 ? 'crit' : 'damage');
        addCombatLog(`${target.name}: ${before}/${target.hpMax} → ${after}/${target.hpMax} HP.`, 'info');
        if (died) addCombatLog(`💀 ${target.name} foi derrotado!`, 'damage');
        floatFeedback(dmg === 0 ? '💫' : '💥', dmg === 0 ? 'ERROU' : '-' + dmg);
    } else if (rule === 'heal') {
        const formula = action.dmg.replace('+', '');
        const base = rollFormula(formula);
        const amt = base.total;
        const before = target.hpCur;
        const after = Math.min(target.hpMax, before + amt);
        const real = after - before;
        setCombatantHp(target.ref, target.kind, after);
        addCombatLog(`${actor.name} usou ${action.icon} ${action.name} em ${target.name}.${costNote}`, 'skill');
        addCombatLog(`Rolagem de cura: ${formula} = ${amt}. Vida recuperada: ${real}.`, 'heal');
        addCombatLog(`${target.name}: ${before}/${target.hpMax} → ${after}/${target.hpMax} HP.`, 'info');
        floatFeedback('💚', '+' + real);
    } else {
        addCombatLog(`${actor.name} usou ${action.icon} ${action.name}.${costNote} ${action.desc} (efeito narrativo — sem mecânica numérica no sistema atual).`, 'skill');
        floatFeedback('✨', 'USADO');
    }
    saveCombat(); saveCharacters();
    closeActionModal();
    renderCombat(); renderPlayerPicker();
}
function resetCombat() {
    if (!combat.creatures.length && !combat.players.length) { alertToast('O combate já está vazio.'); return; }
    showConfirm('Limpar combate atual?', 'Todas as criaturas, personagens e o histórico serão removidos do combate atual.', () => {
        combat = { creatures: [], players: [], history: [] };
        saveCombat();
        closeActionModal(); closeTargetModal();
        renderCombat(); renderPlayerPicker();
        alertToast('Combate limpo.');
    });
}

/* ---------------------------------------------------------
   15. INICIALIZAÇÃO
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => goTo(n.dataset.view)));
    document.querySelectorAll('.step').forEach((el, i) => el.addEventListener('click', () => { if (i + 1 < step) showStep(i + 1); }));
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));
    // load
    seedExampleData();
    updateCharCount();
    renderLibrary();
    renderDiceGrid();
    renderDiceHistory();
    // animação de carregamento
    setTimeout(() => {
        $('loadingScreen').classList.add('fade-out');
        $('app').classList.remove('hidden');
    }, 900);
});