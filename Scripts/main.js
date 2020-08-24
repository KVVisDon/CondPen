// Paramètres de la visualisation
const width = 1200;
const height = 500;
const margin = { top: 50, right: 0, bottom: 20, left: 50 };

const cantons = [
  {id: "AG", name: "Argovie"},
  {id: "AI", name: "Appenzell Rhodes-Intérieures"},
  {id: "AR", name: "Appenzell Rhodes-Extérieures"},
  {id: "BE", name: "Berne"},
  {id: "BL", name: "Bâle-Campagne"},
  {id: "BS", name: "Bâle-Ville"},
  {id: "FR", name: "Fribourg"},
  {id: "GE", name: "Genève"},
  {id: "GL", name: "Glaris"},
  {id: "GR", name: "Grisons"},
  {id: "JU", name: "Jura"},
  {id: "LU", name: "Lucerne"},
  {id: "NE", name: "Neuchâtel"},
  {id: "NW", name: "Nidwald"},
  {id: "OW", name: "Obwald"},
  {id: "SG", name: "St-Gall"},
  {id: "SH", name: "Schaffhouse"},
  {id: "SO", name: "Soleure"},
  {id: "SZ", name: "Schwytz"},
  {id: "TG", name: "Thurgovie"},
  {id: "TI", name: "Tessin"},
  {id: "UR", name: "Uri"},
  {id: "VD", name: "Vaud"},
  {id: "VS", name: "Valais"},
  {id: "ZG", name: "Zoug"},
  {id: "ZH", name: "Zurich"},
];

const annees = [1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

let cpData;

let currentCanton = 'ZH';
let currentAnnee = '2017';

let condBars;
let condTitles;

let condScaleX, condScaleY;
let condColorScale;

function setup () {
  loadData();
  setupCondamnationsPenales();
}

function loadData() {
  d3.dsv(";", "Data/Donnees CP.csv", function (d) {
    return {
      canton: d.Canton,
      annee: d.Year,
      condamnations: d.CondamnationsAdultes
    }
  }).then(onDataLoaded);
}
// Charge les données

function getCantonLongName(canton) {
  return cantons.find(s=>s.id === canton).name;
}

function onDataLoaded(data) {
  cpData = data;

  d3.select('#cantons')
    .selectAll("option")
    .data(cantons)
    .join('option')
      .attr('value', d=>d.id)
      .text(d=>d.name)
      .each(function(d) {
        const option = d3.select(this);
        if(d.id === currentCanton) {
          option.attr("selected", '');
        } else {
          option.attr('selected', null);
        }
      })
  graphCondamnationsPenales();
}

function setupCondamnationsPenales() {
  const minJuge = 0;
  const maxJuge = 18000;

  const svg = d3.select('.cond')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'font: 10px sans-serif');

  condScaleX = d3.scaleBand()
    .domain(annees)
    .range([margin.left, width - margin.right])
    .padding(0.1)
    .round(true);
  
  condScaleY = d3.scaleLinear()
    .domain([minJuge, maxJuge])
    .range([height - margin.bottom - 5, margin.top])
    .interpolate(d3.interpolateRound);

  condColorScale = d3.scaleSequential()
    .domain([minJuge, maxJuge])
    .interpolator(d3.interpolateBlues);

  condBars = svg.append('g');
  condTitles = svg.append('g')
    .style('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${condScaleX.bandwidth() / 2}, 6)`);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(condScaleX))
    .call(g => g.select('.domain').remove());

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(condScaleY))
    .call(g => g.select('.domain').remove());

  d3.select("#cantons").on("change", (e) => {
    const canton = d3.event.target.value;
    currentCanton = canton;
    loadData();
  })

  d3.select("#annee").on("input", (e) => {
    const annee = d3.event.target.value;
    currentAnnee = annee;
    d3.select('.currentAnnee').text(currentAnnee)
    graphCondamnationsPenales();
  })
}
// met en place de la visualisation

function graphCondamnationsPenales() {
  const index = annees.indexOf(Number(currentAnnee))
  var backupAnnee = [...annees]
  backupAnnee.splice(index+1, annees.length-1)
  const data = backupAnnee.map(a => cpData.filter(d => d.canton === currentCanton && d.annee.split('-')[0] == a)).map(t => t[0])

  condBars.selectAll('rect')
    .data(data)
    .join('rect')
      .attr('width', condScaleX.bandwidth())
      .attr('height', d => condScaleY(0) - condScaleY(d.condamnations))
      .attr('x', d => condScaleX(Number(d.annee.split('-')[0])))
      .attr('y', d => condScaleY(d.condamnations))
      .style('fill', d => condColorScale(d.condamnations));
    
  condTitles.selectAll('text')
    .data(data)
    .join('text')
      .attr('dy', '0.35em')
      .attr('x', d => condScaleX(Number(d.annee.split('-')[0])))
      .attr('y', d => condScaleY(d.condamnations))
      .text(d => d.condamnations);
}
// c'est la fonction de dessin et de mise à jour

setup();


// lire instructions du mail session 10 pour la partie READ.me
// questions:
            //3) Faire 2ème graphique en rajoutant un SVG, ajouter la fonctionalité de l'année pour voir les résultats par année pour tous les cantons ou bien faire en sorte que la glissiere par année montre par défaut tous les cantons
            //7) ajouter les icônes des drapeaux des cantons (download via wiki, png créer fichier data avec les drapeaux append.image(svg)) + améliorer mise en page
            //8) Mettre répositoire sur public pour afficher les pages
            //9) Améliorer Readme (selon mail)
            //10) Mettre couleurs au barre des cantons
            //11) Ajuster l'échelle en fonction des cantons