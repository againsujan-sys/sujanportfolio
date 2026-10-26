/* ==========================================================================
   SUJAN PAUDYAL — PORTFOLIO CONTENT DATA
   Single source of truth for all personal content, projects, links & text.
   Edit here; the UI renders from this file.
   ========================================================================== */
'use strict';

window.STRATA_DATA = {
  meta: {
    name: 'Sujan Paudyal',
    title: 'Civil Sub-Engineer & Geologist',
    tagline: 'Sujan Paudyal — Civil Sub-Engineer & Geologist',
    eyebrow: 'B.Sc. Geology · Civil Sub-Engineer · Nepal'
  },

  hero: {
    lead: "I hold a B.Sc. in Geology from Tribhuvan University and work as a Civil Sub-Engineer on RPGCL's Mewa-Changhe 132 kV transmission line in Taplejung, delivering foundation geology, surveying and slope-stability work across Himalayan terrain for 3+ years.",
    credential: 'B.Sc. Geology · Trichandra Multiple Campus, Tribhuvan University',
    photo: 'image/hero-me.jpg',
    photoAlt: 'Sujan Paudyal standing in front of the Pathibhara temple in Taplejung, Nepal',
    actions: [
      { label: 'Download CV', href: 'cv-sujan-paudyal.pdf', download: true, style: 'primary' },
      { label: 'View Projects', href: '#projects', style: 'ghost' },
      { label: 'Contact Me', href: '#contact', style: 'ghost' }
    ]
  },

  about: {
    tagline: 'Quick summary for recruiters — full details follow in Experience, Projects and Education.',
    paragraphs: [
      'I am Sujan Paudyal, a geology graduate (B.Sc., Tri-Chandra Multiple Campus, Tribhuvan University) working as a Civil Sub-Engineer on a live 132 kV transmission-line project in Taplejung for Rastriya Prasaran Grid Company Limited (RPGCL). My work combines geological mapping, rock and soil identification and slope-stability screening with foundation supervision, surveying and construction quality control in complex Himalayan terrain.',
      'Beyond site work, I have published research on transboundary flood dynamics at Rasuwagadhi-Kerung and am currently pursuing a seismic micro-zonation study of Jajarkot. I am open to geotechnical consulting, field-geology positions and graduate research opportunities.'
    ],
    photo: 'image/hero-me.jpg',
    photoAlt: 'Sujan Paudyal at the sacred Pathibhara temple in Taplejung',
    skills: ['Geological Mapping', 'Rock Identification', 'Soil Testing', 'Terrain Analysis', 'AutoCAD', 'Surveying', 'Foundation Construction', 'MS Excel & Word'],
    stats: [
      { label: 'Education', value: 'Bachelor of Science', badge: 'Geology', layer: 'topsoil' },
      { label: 'Field Experience', value: '3+ years in transmission line project', badge: 'Government project', layer: 'sedimentary' },
      { label: 'Research', value: 'Flood dynamics of Rasuwagadhi, Kerung border', badge: 'GEOWORLD Students\u2019 Journal Vol. 13', layer: 'metamorphic' },
      { label: 'Current Focus', value: 'Seismic Micro-zonation of Jajarkot, Nepal', badge: 'In progress', layer: 'igneous' }
    ]
  },

  /* Stratigraphic column — geological eras double as timeline markers */
  education: [
    {
      era: 'Phanerozoic · Quaternary',
      degree: 'Bachelor of Science in Geology',
      institution: 'Tri-Chandra Multiple Campus, Tribhuvan University',
      location: 'Kathmandu',
      text: 'Completed a 4-year curriculum covering Structural Geology, Petrology, Engineering Geology, Hydrogeology, and the Geology of Nepal. Practical training includes geological field mapping, rock mass identification, stratigraphy, and technical field report writing.'
    },
    {
      era: 'Mesozoic · Secondary',
      degree: '+2 Technical Science (Civil Engineering Stream)',
      institution: 'Shree Padma Secondary School',
      location: 'Bhaktapur',
      text: 'Completed technical coursework in Soil Mechanics, Foundation Engineering, Field Surveying, and Highway Engineering alongside foundational sciences. This applied background built a practical understanding of ground stability and soil behavior, directly preparing me for my B.Sc. studies in Engineering Geology.'
    },
    {
      era: 'Paleozoic · Primary',
      degree: 'Secondary Education Examination (SEE) — Technical Stream (Civil Engineering)',
      institution: 'Shree Bhanu Jana Secondary School',
      location: 'Taplejung',
      text: 'Completed technical coursework focused on civil engineering fundamentals, basic surveying, and construction materials. This early vocational training provided my first practical exposure to land structures and material behavior, sparking my long-term academic interest in geotechnical engineering and geology.'
    }
  ],

  jobs: [{
    role: 'Civil Sub-Engineer',
    org: 'Rastriya Prasaran Grid Company Limited (RPGCL)',
    project: 'Mewa-Changhe 132 kV Transmission Line Project, Taplejung',
    duration: '3+ Years',
    points: [
      'Test-pit logging at every tower footing: recorded stratigraphy, weathering grade and groundwater conditions before foundation approval.',
      'Footing inspection sign-offs: verified line, level, dimensions, reinforcement placement and platform concrete against structural specifications prior to steel erection.',
      'Elevation checks: carried out dumpy-level surveys at tower platforms and access trails to confirm formation levels within tolerance.',
      'Slope-hazard screening: evaluated rock and soil stability along tower alignments and flagged landslide/erosion mitigation measures to the design team before and during excavation.',
      'Quantity and records control: maintained daily technical logs, tracked construction quantities and coordinated field communication across project stakeholders.'
    ]
  }],

  internships: [
    {
      title: 'Hydroelectric Site Investigation (OJT)',
      org: 'Madhyaphawa Khola Jalabidhyut Co-operative Ltd. · 6 Months',
      points: [
        'Conducted geological field mapping and terrain surveys along waterway alignments.',
        'Assessed soil and rock stability at planned intake and headworks sites.',
        'Supported civil engineering teams with preliminary field data collection.'
      ]
    },
    {
      title: 'Municipal Engineering Intern',
      org: 'Suryabinayak & Phungling Municipalities · 3 Months Each',
      points: [
        'Assisted with topographic surveys and leveling for municipal road projects.',
        'Inspected slope conditions and drainage pathways for local retaining structures.',
        'Gained practical exposure to municipal civil works and local site evaluations.'
      ]
    }
  ],

  volunteer: [
    { name: 'Tribhuvan University Students Exploration Chapter (TUSEG)', desc: 'Coordinated geological field mapping, technical workshops, and student interaction programs.' },
    { name: 'Community Disaster Preparedness & Hazard Awareness', desc: 'Conducted local awareness on landslide safety, slope monitoring, and flood precautions.' },
    { name: 'Nepal Geological Student Society (NGSS) — Student Volunteer', desc: 'Supported event organization and technical session coordination during geological exhibition.' },
    { name: 'Youth Red Cross — Tri-Chandra Chapter', desc: 'Organized campus blood donation drives and supported first-aid and community health outreach initiatives.' },
    { name: 'Amnesty International — Tri-Chandra Youth Network', desc: 'Participated in youth leadership campaigns, social awareness drives, and community advocacy programs.' }
  ],

  /* Core-sample project showcase */
  cores: [
    {
      id: 'flood-dynamics',
      icon: '🌊',
      depth: 'CORE 01 · 0–13 m',
      lithology: 'Alluvial & fluvial deposits',
      meta: 'Published Research · GeoWorld Journal',
      title: 'Flood Dynamics at Rasuwagadhi-Kerung Border',
      summary: 'Field-based study analyzing mountain flood hazards, terrain vulnerabilities, and disaster risk management along the transboundary corridor. Published in GeoWorld Students\u2019 Journal.',
      tags: ['Publication', 'Disaster Risk', 'Geomorphology', 'Flood Analysis'],
      link: { href: 'paper.pdf', label: 'Read Paper (PDF)', target: '_blank' },
      image: 'image/geological-field-visit.jpg',
      imageAlt: 'River channel measurement and field research near the Rasuwagadhi-Kerung transboundary corridor',
      bands: ['#8a5a3b', '#a9714b', '#6d4630', '#c98d5f', '#7b4f36']
    },
    {
      id: 'transmission-line',
      icon: '⛰️',
      depth: 'CORE 02 · 13–45 m',
      lithology: 'Mid-Himalayan crystalline basement',
      meta: 'Applied Field Engineering · RPGCL',
      title: 'Mewa-Changhe 132 kV Transmission Line Geotech',
      summary: 'Foundation geology along active Himalayan alignments: rock & soil identification, test-pit logging, slope-stability screening and footing quality control across complex terrain in Taplejung.',
      tags: ['Slope Stability', 'Foundation Engineering', 'Field Mapping', 'QC'],
      link: null,
      image: 'image/mewa-site-2.jpg',
      imageAlt: 'Field crew reviewing a foundation excavation pit on a grassy hillside',
      bands: ['#3f3d45', '#5b5148', '#7a6a55', '#4a4a52', '#63564a']
    },
    {
      id: 'microzonation',
      icon: '📈',
      depth: 'CORE 03 · 45–80 m',
      lithology: 'Siwalik molasse · in progress',
      meta: 'Seismotectonics · In Progress',
      title: 'Seismic Micro-zonation of Jajarkot, Nepal',
      summary: 'Ongoing study characterising site-specific ground response after the 2023 Jajarkot earthquake sequence — integrating geological, geotechnical and seismic data for safer reconstruction.',
      tags: ['Earthquake Geology', 'Site Response', 'Microzonation'],
      link: null,
      milestones: [
        { date: 'Nov 2023', event: '2023 Jajarkot Mw 6.4 earthquake sequence — epicentral region defined as the study area.' },
        { date: '2024', event: 'Literature synthesis and seismotectonic framework review completed.' },
        { date: '2025', event: 'Geological, geotechnical and strong-motion data compilation; reconnaissance mapping of Siwalik–Lesser-Himalayan terrain.' },
        { date: 'In progress', event: 'Site-response analysis and zonation framework development.' },
        { date: 'Planned', event: 'Micro-zonation report and map for the study area; findings and publication will be cited here once released.' }
      ],
      image: 'image/discussion-about-research-tu.jpg',
      imageAlt: 'Geological fieldwork in Himalayan terrain relevant to seismic micro-zonation research',
      bands: ['#b6552e', '#d97e4a', '#8f3f22', '#e0925c', '#a04a26']
    },
    {
      id: 'hydro-site',
      icon: '💧',
      depth: 'CORE 04 · 80–120 m',
      lithology: 'River-bed gravels & gneiss',
      meta: 'On-the-Job Training · Hydropower',
      title: 'Madhyaphawa Khola Hydroelectric Site Investigation',
      summary: 'Six-month OJT: geological mapping and terrain surveys along waterway alignments; stability assessment of intake and headworks foundations for a run-of-river scheme.',
      tags: ['Engineering Geology', 'Hydropower', 'Geological Mapping'],
      link: null,
      image: 'image/during-new-location-hunt-taplejung-manabhara.jpg',
      imageAlt: 'Geological investigation along a Himalayan river corridor during hydroelectric site survey',
      bands: ['#2f4d57', '#41697a', '#24404a', '#5b8798', '#315562']
    }
  ],

  gallery: [
    { src: 'image/mewa-site-1.jpg',   site: 'taplejung',   cat: 'fieldwork', caption: 'Tower boundary-marker inspection, Mewa\u2013Changhe 132 kV alignment, Taplejung.', alt: 'Field crew inspecting a boundary marker at a transmission tower site overlooking a valley' },
    { src: 'image/mewa-site-2.jpg',  site: 'taplejung',   cat: 'project',   caption: 'Test-pit / foundation excavation review with the site crew, tower footing in Taplejung.', alt: 'Field crew reviewing a foundation excavation pit on a grassy hillside' },
    { src: 'image/mewa-site-3.jpg', site: 'taplejung',   cat: 'fieldwork', caption: 'Completed RC tower foundation base signed off before steel erection, RPGCL project, Taplejung.', alt: 'Completed reinforced concrete tower foundation base ready for steel erection' },
    { src: 'image/mewa-site-4.jpg', site: 'taplejung',   cat: 'fieldwork', caption: 'Walking the platform during a site visit on a steep Taplejung slope.', alt: 'Two engineers walking across a foundation platform on a steep slope' },
    { src: 'image/mewa-site-5.jpg', site: 'taplejung',   cat: 'fieldwork', caption: 'Reconnaissance along the transmission corridor, Taplejung hills.', alt: 'Geologist walking a hillside traverse along a transmission-line corridor in Taplejung' },
    { src: 'image/mewa-site-6.jpg', site: 'taplejung',   cat: 'fieldwork', caption: 'Logistics staging area beside the tower access trail, Taplejung.', alt: 'Field equipment staged beside a mountain access trail at a transmission tower site' },
    { src: 'image/mewa-site-7.jpg', site: 'taplejung',   cat: 'fieldwork', caption: 'Access-trail works beside a tower platform, Mewa\u2013Changhe alignment.', alt: 'Tower access trail and retaining works cut into a steep Taplejung hillside' },
    { src: 'image/taplejung-helipad.jpg', site: 'taplejung', cat: 'fieldwork', caption: 'Helipad ground check during a logistics recce above Phungling, Taplejung.', alt: 'Hilltop helipad used for material logistics in the Taplejung hills' },
    { src: 'image/during-new-location-hunt-taplejung-manabhara.jpg', site: 'madhyaphawa', cat: 'project', caption: 'River-corridor survey along Madhyaphawa Khola during the hydroelectric OJT.', alt: 'Geological investigation along a boulder-strewn Himalayan river corridor during a hydroelectric site survey' },
    { src: 'image/geological-field-visit.jpg', site: 'rasuwagadhi', cat: 'project', caption: 'Channel observation during the Rasuwagadhi\u2013Kerung field visit.', alt: 'River channel measurement and field research near the Rasuwagadhi-Kerung transboundary corridor' },
    { src: 'image/discussion-about-research-tu.jpg', site: 'jajarkot', cat: 'project', caption: 'Planning the Jajarkot micro-zonation study with fellow students, Tribhuvan University.', alt: 'Students discussing seismic micro-zonation research at Tribhuvan University' },
    { src: 'image/at-trichandra.jpg', site: 'kathmandu', cat: 'fieldwork', caption: 'Campus mapping exercise around Tri-Chandra Multiple Campus.', alt: 'Practical mapping exercise around the Tri-Chandra campus grounds' }
  ],

  travelPhotos: [
    { src: 'image/hero-me.jpg', site: 'taplejung', caption: 'Portrait in front of the sacred Pathibhara temple, Taplejung.', alt: 'Sujan Paudyal standing in front of the Pathibhara temple in Taplejung' },
    { src: 'image/behind-sacred-pathibhara-temple-taplejung.jpg', site: 'Pathibhara', caption: 'Trail behind the Pathibhara temple leading toward Pathibhara, Taplejung.', alt: 'Trail behind the Pathibhara temple leading toward Pathibhara, Taplejung' },
    { src: 'image/with-friends-behind-temple.jpg', site: 'taplejung', caption: 'With friends behind the temple, Pathibhara, Taplejung.', alt: 'Friends together behind the temple at Pathibhara, Taplejung' },
    { src: 'image/taplejung-helipad.jpg', site: 'taplejung', caption: 'Helipad ground check during a logistics recce above Phungling, Taplejung.', alt: 'Hilltop helipad used for material logistics above Phungling, Taplejung' },
    { src: 'image/childhood-1.jpg', site: 'taplejung', caption: 'Childhood days in Taplejung.', alt: 'Photograph from early childhood in Taplejung' },
    { src: 'image/childhood-2.jpg', site: 'taplejung', caption: 'Growing up in the eastern hills.', alt: 'Childhood photograph taken in the eastern hills of Nepal' },
    { src: 'image/childhood-3.jpg', site: 'taplejung', caption: 'Childhood years at the family home, Taplejung.', alt: 'Childhood photograph from the family home in Taplejung' },
    { src: 'image/childhood-4.jpg', site: 'taplejung', caption: 'School days back home in Taplejung.', alt: 'School-age photograph taken in Taplejung' },
    { src: 'image/childhood-5.jpg', site: 'taplejung', caption: 'A summer portrait from the eastern hills.', alt: 'Childhood portrait from the eastern hills of Nepal' },
    { src: 'image/me01.jpg', site: 'kathmandu', caption: 'Profile portrait, Kathmandu.', alt: 'Profile portrait of Sujan Paudyal in Kathmandu' },
    { src: 'image/at-tri-chandra-campus.jpg', site: 'kathmandu', caption: 'At Tri-Chandra Multiple Campus, Kathmandu.', alt: 'Grounds of Tri-Chandra Multiple Campus, Tribhuvan University' },
    { src: 'image/professor.jpg', site: 'kathmandu', caption: 'Research discussion with my geology professor, Tri-Chandra Multiple Campus.', alt: 'Research discussion with a geology professor at Tri-Chandra Multiple Campus' },
    { src: 'image/with-professor.jpg', site: 'kathmandu', caption: 'Standing with my geology professor at Tri-Chandra Multiple Campus.', alt: 'Standing with a geology professor at Tri-Chandra Multiple Campus' },
    { src: 'image/with-student-president-at-campus.jpg', site: 'kathmandu', caption: 'With the campus student president, Tri-Chandra.', alt: 'Sujan Paudyal with the student president at Tri-Chandra Multiple Campus' },
    { src: 'image/with-actor-at-college.jpg', site: 'kathmandu', caption: 'College programme \u2014 moment with a guest actor.', alt: 'Photo with a guest actor at a college programme in Kathmandu' },
    { src: 'image/birthday-celebration-at-college.jpg', site: 'kathmandu', caption: 'Birthday celebration at college.', alt: 'Friends celebrating a birthday on the college campus' },
    { src: 'image/at-library.jpg', site: 'kathmandu', caption: 'Study hours at the campus library.', alt: 'Studying inside the campus library in Kathmandu' },
    { src: 'image/at-museum.jpg', site: 'kathmandu', caption: 'Geology museum visit, Kathmandu.', alt: 'Rock and mineral displays at the geology museum in Kathmandu' },
    { src: 'image/at-cultural-event-kathmandu.jpg', site: 'kathmandu', caption: 'Cultural event in Kathmandu.', alt: 'Attending a cultural event in Kathmandu' },
    { src: 'image/geological-event-at-tu.jpg', site: 'kathmandu', caption: 'Geological event at Tribhuvan University.', alt: 'Departmental geological event at Tribhuvan University' },
    { src: 'image/geology-exhibition-1.jpg', site: 'kathmandu', caption: 'NGSS geology exhibition \u2014 stall setup.', alt: 'Geology exhibition organised by the Nepal Geological Student Society' },
    { src: 'image/geology-exhibition-2.jpg', site: 'kathmandu', caption: 'NGSS geology exhibition \u2014 rock samples on display.', alt: 'Rock and mineral samples displayed at the geology exhibition' },
    { src: 'image/geology-exhibition-3.jpg', site: 'kathmandu', caption: 'NGSS geology exhibition \u2014 guided sample walkthrough.', alt: 'Visitors walking through the geology exhibition displays' },
    { src: 'image/central-department-of-geology.jpg', site: 'kathmandu', caption: 'Central Department of Geology, Tribhuvan University.', alt: 'Building of the Central Department of Geology, Tribhuvan University' },
    { src: 'image/at-pashupatinath.jpg', site: 'kathmandu', caption: 'At Pashupatinath, Kathmandu.', alt: 'Visit to the Pashupatinath temple area in Kathmandu' },
    { src: 'image/boudha-kathmandu.jpg', site: 'kathmandu', caption: 'Boudhanath stupa, Kathmandu.', alt: 'Boudhanath stupa in Kathmandu' },
    { src: 'image/at-tarkeshor-view-point.jpg', site: 'kathmandu', caption: 'Viewpoint at Tarkeshwor, Kathmandu.', alt: 'Hilltop viewpoint from Tarkeshwor temple above Kathmandu' },
    { src: 'image/behind-dakshinkali-1.jpg', site: 'kathmandu', caption: 'Dakshinkali temple surroundings, Kathmandu.', alt: 'Scenery behind the Dakshinkali temple south of Kathmandu' },
    { src: 'image/behind-dakshinkali-2.jpg', site: 'kathmandu', caption: 'Trail behind Dakshinkali.', alt: 'Forest trail behind the Dakshinkali temple area' },
    { src: 'image/behind-gumba.jpg', site: 'kathmandu', caption: 'Behind the monastery (gumba), Kathmandu.', alt: 'Quiet lane behind a Kathmandu monastery' },
    { src: 'image/with-friends-kamalpokhari.jpg', site: 'kathmandu', caption: 'Evening with friends at Kamalpokhari, Kathmandu.', alt: 'Sujan Paudyal with friends at Kamalpokhari pond, Kathmandu' },
    { src: 'image/during-crystal-hunt.jpg', site: 'kathmandu', caption: 'Mineral-hunting trip with friends.', alt: 'Searching for crystals during a mineral-hunting field trip near Kathmandu' },
    { src: 'image/with-friends-at-campus.jpg', site: 'kathmandu', caption: 'With friends on campus, Kathmandu.', alt: 'Friends together on the Tri-Chandra campus, Kathmandu' },
    { src: 'image/behind-home-ministry.jpg', site: 'kathmandu', caption: 'Behind the Home Ministry, Singh Durbar, Kathmandu.', alt: 'View from behind the Home Ministry building, Singh Durbar, Kathmandu' },
    { src: 'image/behind-foreign-ministry.jpg', site: 'kathmandu', caption: 'Behind the Foreign Ministry, Kathmandu.', alt: 'View from behind the Ministry of Foreign Affairs, Kathmandu' },
    { src: 'image/during-new-location-hunt-taplejung-manabhara.jpg', site: 'Manabhara', caption: 'Scouting a new tower location along the Manabhara stretch, Taplejung.', alt: 'Scouting a new tower location along the Manabhara stretch, Taplejung' },
    { src: 'image/at-trichandra.jpg', site: 'madhyaphawa', caption: 'Pre-field terrain mapping exercise before the Madhyaphawa Khola survey.', alt: 'Practical terrain-mapping exercise ahead of the Madhyaphawa Khola hydroelectric survey' },
    { src: 'image/at-trichandra-2.jpg', site: 'madhyaphawa', caption: 'Second mapping-practice session ahead of the hydroelectric site visit.', alt: 'Second session of corridor mapping practice ahead of the hydroelectric site visit' },
    { src: 'image/geological-field-visit.jpg', site: 'rasuwagadhi', caption: 'Channel observation during the Rasuwagadhi\u2013Kerung field visit.', alt: 'River channel measurement and field research near the Rasuwagadhi-Kerung transboundary corridor' },
    { src: 'image/discussion-about-research-tu.jpg', site: 'jajarkot', caption: 'Planning the Jajarkot micro-zonation study with fellow students, Tribhuvan University.', alt: 'Students discussing seismic micro-zonation research at Tribhuvan University' }
  ],

  /* Testimonials — kept in sync with the static #testimonials-grid markup in
     index.html. main.js only renders these if the grid is empty, so nothing
     is ever duplicated. */
  testimonials: [
    { badge: 'Field Colleague', initials: 'UD', name: 'Uddhab Dhungana', role: '',
      text: 'I got to know Mr. Sujan Paudyal during the foundation construction work of the transmission line. He is an extremely hardworking, helpful individual who is always eager to learn new things. His dedication to work, curious nature, and interest in acquiring new knowledge are truly commendable.' },
    { badge: 'Classmate', initials: 'SB', name: 'Subash Bhandari', role: '',
      text: 'Sujan Paudyal is an exceptionally helpful, courageous, and confident personality. He possesses deep studiousness and a keen curiosity, always eager to learn new things. As a class representative, his leadership skills in fearlessly raising a voice for students\u2019 rights and welfare, along with his energetic nature and dedication to work, are truly admirable. I firmly believe his unique qualities will bring him success in every field.' },
    { badge: 'Professional Peer', initials: 'BBP', name: 'Bishal Babu Paudel', role: '',
      text: 'Working with Sujan Paudyal has been a truly rewarding experience. As a skilled geologist and technology enthusiast, he combines strong field expertise, technical proficiency, innovative thinking, and practical problem-solving skills with remarkable dedication and professionalism.' },
    { badge: 'Friend', initials: 'SB', name: 'Suyog Bhattarai', role: '',
      text: "Hanging out with Sujan is always a blast! He's a fantastic guy with a genuinely helpful hand and a great energy to be around. Whether we're sharing a laugh or working through something, every moment is fun and memorable." }
  ],

  mapSites: [
    { id: 'taplejung', type: 'work', name: 'Taplejung', role: 'Field Work', org: 'RPGCL \u00b7 Mewa\u2013Changhe 132 kV Transmission Line', place: 'Phungling, Taplejung, Koshi Province', coords: [27.3533, 87.6667], zoom: 11 },
    { id: 'madhyaphawa', type: 'work', name: 'Madhyaphawa Khola', role: 'Field Work', org: 'Hydroelectric site investigation (OJT)', place: 'Madhyaphawa Khola corridor, Taplejung', coords: [27.15, 87.75], zoom: 12 },
    { id: 'rasuwagadhi', type: 'research', name: 'Rasuwagadhi\u2013Kerung', role: 'Research', org: 'Published flood dynamics study \u00b7 GeoWorld Journal', place: 'Rasuwagadhi border point, Rasuwa District', coords: [28.2833, 85.3833], zoom: 11 },
    { id: 'jajarkot', type: 'research', name: 'Jajarkot', role: 'Research', org: 'Seismic micro-zonation study (in progress)', place: 'Jajarkot District \u2014 2023 Mw 6.4 epicentral region', coords: [28.72, 82.19], zoom: 11 },
    { id: 'Manabhara', type: 'work', name: 'Manabhara', role: 'Field Work', org: 'New tower-location recce \u00b7 transmission alignment', place: 'Manabhara, Taplejung, Koshi Province', coords: [27.30, 87.72], zoom: 12 },
    { id: 'Pathibhara', type: 'travel', name: 'Pathibhara', role: 'Travel', org: 'Pathibhara temple approach \u00b7 highland terrain', place: 'Pathibhara, Taplejung, Koshi Province', coords: [27.40, 87.72], zoom: 12 },
    { id: 'kathmandu', type: 'study', name: 'Kathmandu', role: 'Academic', org: 'Tri-Chandra Multiple Campus, Tribhuvan University', place: 'Ghantaghar, Kathmandu', coords: [27.7172, 85.324], zoom: 12 }
  ],

  contact: {
    intro: 'I\'m open to graduate research opportunities, consulting, and project collaborations. Let\'s connect!',
    rows: [
      { label: 'Email', value: 'again.sujan@gmail.com', href: 'mailto:again.sujan@gmail.com', copy: true },
      { label: 'Phone', value: '+977 986-7996682', href: 'tel:+9779867996682', copy: true },
      { label: 'LinkedIn', value: 'linkedin.com/in/sujanpaudyal', href: 'https://www.linkedin.com/in/sujanpaudyal', external: true },
      { label: 'Location', value: 'Kathmandu / Koshi Province, Nepal' },
      { label: 'References', value: 'Academic & professional references available on request' }
    ],
    languages: 'Languages: Nepali (native) · English (fluent) · Hindi (conversational)'
  },

  footer: {
    copyright: '© 2026 Sujan Paudyal. Formed over deep time, built with clean code.',
    links: ['Home', 'Qualifications', 'Experience', 'Projects', 'Research', 'Education', 'Testimonials', 'Fieldwork', "Places I've Travelled", 'Contact']
  }
};
