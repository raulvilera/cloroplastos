# Atividade de Ciências — 6º ano — 3º bimestre

Pacote para publicar uma atividade interativa de Ciências para as turmas **6º Ano A** e **6º Ano C**, alinhada ao Guia Priorizado de Ciências 2026.

## Arquivos

- `index.html`: interface da atividade, com 7 questões objetivas, 3 dissertativas, imagens SVG incorporadas, dropdowns dependentes e feedback visual. A versão publicada no GitHub Pages carrega a lista de alunos diretamente no HTML.
- `Code.gs`: backend do Google Apps Script. Registra as respostas na planilha, calcula acertos objetivos, nota inteira de 0 a 10, percentual e status das aprendizagens, inclusive quando recebe dados por `doPost`.
- `Roster.csv`: lista extraída dos arquivos `6ºAnoA(WD).xlt` e `6ºAnoC(WD).xlt`, com turma, nome e RA.

## Alinhamento pedagógico

As questões 1 a 9 mobilizam a **AE5 — analisar a organização básica das células, reconhecendo-as como unidade estrutural e funcional dos seres vivos unicelulares e pluricelulares**, associada à habilidade **EF06CI05** e às aulas 1 a 14. A questão 10 mobiliza a **AE6 — analisar a organização de tecidos e sistemas nos seres vivos multicelulares**, associada à habilidade **EF06CI06** e às aulas 15 e 16. O conjunto contempla os descritores de reconhecimento, identificação, classificação, relação entre estruturas e funções e organização em níveis indicados na Matriz da Prova Paulista.

## Publicação

1. Abra a planilha informada pela escola e confirme que você tem permissão de edição: [planilha Google Sheets](https://docs.google.com/spreadsheets/d/1DVJ2kY3QDdi0YLUUWacYa7qkcURYkO7SckhZN-t99qg/edit).
2. Vá a **Extensões → Apps Script**.
3. Renomeie o arquivo padrão para `Code.gs` e cole o conteúdo de `Code.gs` deste pacote.
4. Crie um arquivo HTML pelo botão **+ → HTML**, nomeie-o exatamente `index` e cole o conteúdo de `index.html`.
5. Salve e execute a função `setup` uma vez. Autorize o projeto quando solicitado.
6. Na aba `Roster`, cole os dados de `Roster.csv` a partir da célula A1. Se a aba já possuir dados, substitua-os pelos três campos: `Turma`, `Nome`, `RA`.
7. Volte ao Apps Script e execute `setup` novamente para garantir as regras de formatação condicional.
8. Selecione **Implantar → Nova implantação → Aplicativo da web**. Escolha executar como **usuário que sou eu** e acesso **qualquer pessoa com o link** (ou a política institucional equivalente). Copie a URL gerada para os alunos.
9. No `index.html`, localize `const SCRIPT_URL = "";` e substitua o conteúdo vazio pela URL do Aplicativo da Web. Faça um novo commit para que o GitHub Pages envie as respostas à planilha. Sem essa URL, a atividade continua funcionando para visualização e preenchimento, mas não grava os dados.

## GitHub Pages versus Apps Script

O GitHub Pages é um servidor estático: ele não interpreta `<?= roster ?>` e não possui `google.script.run`. Por isso, a atividade publicada no GitHub Pages usa a lista incorporada no HTML e envia as respostas por `fetch` para `doPost(e)` do Apps Script. Se o arquivo for publicado diretamente dentro do editor do Apps Script, a integração `google.script.run` também pode ser usada, mas a versão deste repositório foi preparada para o GitHub Pages.

## O que é registrado

Cada envio cria uma linha na aba `Respostas` com data/hora, turma, nome, RA, letras escolhidas nas sete objetivas, textos das três dissertativas, gabarito, resultado de cada objetiva, acertos, nota inteira, percentual, status de AE5 e AE6 e aprendizagens não atingidas.

As células Q1–Q7 recebem **azul** quando a alternativa está correta e **vermelho** quando está errada. As células de AE recebem azul para **ATINGIDA** e vermelho para **NÃO ATINGIDA**. As respostas dissertativas são armazenadas para análise/correção do professor e não são corrigidas automaticamente, pois exigem critérios pedagógicos e leitura da produção do aluno.

## Observações

A nota automática é calculada sobre as sete questões objetivas: `arredondar(acertos ÷ 7 × 10)`. O percentual também é calculado sobre as objetivas. As dissertativas permanecem disponíveis para uma etapa posterior de correção, caso a escola queira atribuir pontuação a elas.

As imagens são ilustrações SVG didáticas incorporadas no próprio HTML; portanto, a atividade não depende de hospedagem ou download de imagens externas.

## Fontes das imagens reais

As imagens microscópicas e fotografias são provenientes do Wikimedia Commons e são carregadas por URL no HTML. Os créditos e as licenças aparecem abaixo de cada imagem: [células da bochecha](https://commons.wikimedia.org/wiki/File:Cheekcells_stained.jpg), [microscópio óptico](https://commons.wikimedia.org/wiki/File:Laboratory_Optical_Microscope.jpg), [células vegetais](https://commons.wikimedia.org/wiki/File:C%C3%A9lulas_de_flores_en_turgencia_Aumento_total-_400x.jpg), [Bacillus subtilis](https://commons.wikimedia.org/wiki/File:Bacillus_subtilis_2.jpg), [fungos com leveduras e hifas](https://commons.wikimedia.org/wiki/File:Fungal_yeast_cells,_budding_and_hyphae_in_sputum_specimen.jpg), [protozoários](https://commons.wikimedia.org/wiki/File:Protist_collage.jpg), [estação de tratamento de água](https://commons.wikimedia.org/wiki/File:Water_Treatment_Plant_(540116581).jpg), [SARS-CoV-2](https://commons.wikimedia.org/wiki/File:SARS-CoV-2_scanning_electron_microscope_image.jpg) e [osso compacto](https://commons.wikimedia.org/wiki/File:Compact_bone_-_ground_cross_section.jpg). As atribuições completas e as respectivas licenças também aparecem nas legendas da atividade.
