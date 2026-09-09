const SHEET_ID = '1DVJ2kY3QDdi0YLUUWacYa7qkcURYkO7SckhZN-t99qg';
const ANSWERS = {1:'B',2:'C',3:'A',4:'D',5:'B',6:'A',7:'A'};

function doGet() {
  const t = HtmlService.createTemplateFromFile('index');
  t.roster = JSON.stringify(getRoster_());
  return t.evaluate().setTitle('Atividade de Ciências — 6º ano').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getRoster_() {
  const ss = SpreadsheetApp.openById(SHEET_ID), sh = ss.getSheetByName('Roster');
  const out = {'6º Ano A':[], '6º Ano C':[]};
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2,1,sh.getLastRow()-1,3).getDisplayValues().forEach(r => {
    if (r[0] && out[r[0]] && r[1]) out[r[0]].push({nome:r[1],ra:r[2]});
  });
  return out;
}

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName('Respostas') || ss.insertSheet('Respostas');
  const headers = ['Data/hora','Turma','Nome','RA','Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8 — dissertativa','Q9 — dissertativa','Q10 — dissertativa','Gabarito objetivos','Q1–Q7 — resultado','Acertos objetivos','Nota inteira','Percentual','AE5 — status','AE6 — status','AEs não atingidas'];
  sh.clear(); sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#07528f').setFontColor('#ffffff');
  sh.setFrozenRows(1); sh.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm'); sh.autoResizeColumns(1,headers.length);
  let roster = ss.getSheetByName('Roster') || ss.insertSheet('Roster');
  if (roster.getLastRow()===0) roster.getRange(1,1,1,3).setValues([['Turma','Nome','RA']]);
  roster.getRange(1,1,1,3).setFontWeight('bold').setBackground('#07528f').setFontColor('#ffffff');
  const correct = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=REGEXMATCH($P2,"CORRETA")').setBackground('#2f75b5').setFontColor('#ffffff').setRanges([sh.getRange('E2:K')]).build();
  const wrong = SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=REGEXMATCH($P2,"ERRADA")').setBackground('#c00000').setFontColor('#ffffff').setRanges([sh.getRange('E2:K')]).build();
  const aeGood = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('ATINGIDA').setBackground('#2f75b5').setFontColor('#ffffff').setRanges([sh.getRange('T2:U')]).build();
  const aeBad = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('NÃO ATINGIDA').setBackground('#c00000').setFontColor('#ffffff').setRanges([sh.getRange('T2:U')]).build();
  sh.setConditionalFormatRules([correct,wrong,aeGood,aeBad]);
  return 'Configuração concluída. Agora cole o Roster.csv na aba Roster e publique como aplicativo da web.';
}

function submitAnswers(p) {
  if (!p || !p.turma || !p.nome || !p.ra) throw new Error('Identificação incompleta.');
  const ss=SpreadsheetApp.openById(SHEET_ID), sh=ss.getSheetByName('Respostas') || ss.insertSheet('Respostas');
  if (sh.getLastRow()===0) setup();
  const a=p.respostas||{}, answers=[]; let acertos=0;
  for(let i=1;i<=7;i++){const v=String(a[i]||'').toUpperCase(); answers.push(v); if(v===ANSWERS[i]) acertos++;}
  const status=answers.map((v,i)=>v===ANSWERS[i+1]?'CORRETA':'ERRADA');
  const nota=Math.round((acertos/7)*10), percentual=Math.round((acertos/7)*100);
  const ae5Ok=answers.slice(0,6).filter((v,i)=>v===ANSWERS[i+1]).length>=4, ae6Ok=answers[6]===ANSWERS[7];
  const nao=[]; if(!ae5Ok) nao.push('AE5 — organização básica das células'); if(!ae6Ok) nao.push('AE6 — tecidos e sistemas');
  const row=[new Date(),p.turma,p.nome,p.ra,...answers,a[8]||'',a[9]||'',a[10]||'',Object.values(ANSWERS).join(' | '),status.join(' | '),acertos,nota,percentual+'%',ae5Ok?'ATINGIDA':'NÃO ATINGIDA',ae6Ok?'ATINGIDA':'NÃO ATINGIDA',nao.join(' | ')||'Nenhuma'];
  sh.appendRow(row); sh.getRange(sh.getLastRow(),1).setNumberFormat('dd/mm/yyyy hh:mm');
  return {nota,percentual,naoAtingidas:nao.join(', ')||'nenhuma'};
}


function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');
  const result = submitAnswers(payload);
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
