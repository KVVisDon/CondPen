// Paramètres de la visualisation
const width = 2000;
const height = 300;
const margin = { top: 120, right: 0, bottom: 20, left: 50 };

d3.dsv(";", "Data/Donnees CP.csv", function (d) {
    return {
        canton: d.Canton,
        annee: d.Year,
        condamnations: d.CondamnationsAdultes
    };
}).then(function(data) {
    
    const canton = data.filter(d => d.canton === "ZH");


  // Créer l'élément SVG et le configurer
    const svg = d3.select('.main')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'font: 10px sans-serif')
  
  // Créer l'échelle horizontale (fonctions D3)
    const x = d3.scaleBand()
    .domain(canton.map(d => d.annee))
    .range([margin.left, width - margin.right])
    .padding(0.1)
    .round(true)
  
  // Créer l'échelle verticale (fonctions D3)
    const y = d3.scaleLinear()
    .domain([0, d3.max(canton, d => d.condamnations)])
    .range([height - margin.bottom - 5, margin.top])
    .interpolate(d3.interpolateRound)
  
    const teinte = d3.scaleSequential()
    .domain([0, d3.max(canton, d => d.condamnations)])
    .interpolator(d3.interpolateBlues)
  
  // Ajouter les barres
    svg.append('g')
    .selectAll('rect')
    .data(canton)
    .enter()
    .append('rect')
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d.condamnations))
    .attr('x', d => x(d.annee))
    .attr('y', d => y(d.condamnations))
    .style('fill', d => teinte(d.condamnations))
  
  // Ajouter les titres
    svg.append('g')
    .style('fill', 'white')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${x.bandwidth() / 2}, 6)`)
    .selectAll('text')
    .data(canton)
    .enter()
    .append('text')
    .attr('dy', '0.35em')
    .attr('x', d => x(d.annee))
    .attr('y', d => y(d.condamnations))
    .text(d => d.condamnations)
  
  // Ajouter l'axe horizontal
    svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.select('.domain').remove())
  
  // Ajouter l'axe vertical
    svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select('.domain').remove())

});

// vérifier les chiffres sur l'echelle verticale
// vidéo 10 GitHub Pages à faire - sinon, lui signaler que on a pas fait cet étape puisque c'est payant