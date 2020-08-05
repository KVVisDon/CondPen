// Paramètres de la visualisation
const width = 2000;
const height = 300;
const margin = { top: 120, right: 0, bottom: 20, left: 50 };

let cpData;

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

function onDataLoaded(data) {
  cpData = data;
  graphCondamnationsPenales("ZH");
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
    .domain([1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017])
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
}

function graphCondamnationsPenales(canton) {
  const data = cpData.filter(d => d.canton === "ZH");

  condBars.selectAll('rect')
    .data(data)
    .join('rect')
      .attr('width', condScaleX.bandwidth())
      .attr('height', d => condScaleY(0) - condScaleY(d.condamnations))
      .attr('x', d => condScaleX(d.annee))
      .attr('y', d => condScaleY(d.condamnations))
      .style('fill', d => condColorScale(d.condamnations));
    
  condTitles.selectAll('text')
    .data(data)
    .join('text')
      .attr('dy', '0.35em')
      .attr('x', d => condScaleX(d.annee))
      .attr('y', d => condScaleY(d.condamnations))
      .text(d => d.condamnations);
}

setup();

// vérifier les chiffres sur l'echelle verticale
// vidéo 10 GitHub Pages à faire - sinon, lui signaler que on a pas fait cet étape puisque c'est payant
// lire instructions du mail session 10 pour la partie READ.me