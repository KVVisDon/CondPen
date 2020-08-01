// Paramètres de la visualisation
const width = 600;
const height = 300;
const margin = { top: 20, right: 0, bottom: 20, left: 20 };

// Données
const fruits = [
  { name: "🍊", count: 21 , color: 'orange' },
  { name: "🍇", count: 13 , color: 'blueviolet' },
  { name: "🍏", count: 8 , color: 'greenyellow' },
  { name: "🍌", count: 5 , color: 'yellow' },
  { name: "🍐", count: 3 , color: 'yellowgreen' },
  { name: "🍋", count: 2 , color: 'gold' },
  { name: "🍎", count: 1 , color: 'red' },
  { name: "🍉", count: 1 , color: 'orangered' }
];

// Créer l'élément SVG et le configurer
const svg = d3.select('.main')
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .attr('style', 'font: 10px sans-serif')

// Créer l'échelle horizontale (fonctions D3)
const x = d3.scaleBand()
            .domain(fruits.map(d => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1)
            .round(true)

// Créer l'échelle verticale (fonctions D3)
const y = d3.scaleLinear()
            .domain([0, d3.max(fruits, d => d.count)])
            .range([height - margin.bottom - 5, margin.top])
            .interpolate(d3.interpolateRound)

// Ajouter les barres
svg.append('g')
   .selectAll('rect')
     .data(fruits)
     .enter()
     .append('rect')
     .attr('width', x.bandwidth())
     .attr('height', d => y(0) - y(d.count))
     .attr('x', d => x(d.name))
     .attr('y', d => y(d.count))
     .style('fill', d => d.color)

// Ajouter les titres
svg.append('g')
   .style('fill', 'white')
   .attr('text-anchor', 'middle')
   .attr('transform', `translate(${x.bandwidth() / 2}, 6)`)
   .selectAll('text')
     .data(fruits)
     .enter()
     .append('text')
     .attr('dy', '0.35em')
     .attr('x', d => x(d.name))
     .attr('y', d => y(d.count))
     .text(d => d.count)

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