import { ReadingModule } from '../types/module';

export const SAMPLE_MODULES: ReadingModule[] = [
  {
    title: 'The Double-Edged Sword of Algorithmic Governance in Contemporary Higher Education',
    targetLevel: 'IELTS Band 7.5 / CEFR C1',
    structureType: 'Argumentative Pros/Cons',
    topic: 'Artificial Intelligence and Algorithmic Evaluation in Higher Education',
    wordCount: 312,
    readingText: {
      fullText:
        'The rapid integration of predictive analytics and automated grading within tertiary institutions has sparked a contentious discourse regarding academic integrity and pedagogy. Proponents assert that machine-learning frameworks can democratize student support by pinpointing vulnerable learners before scholastic failure ensues. Furthermore, advocates maintain that mechanized assessment alleviates the arduous grading burden borne by faculty, thereby cultivating greater bandwidth for individual mentorship. Consequently, university administrators have increasingly deployed algorithmic infrastructure across enrollment, pastoral care, and examination evaluation.\n\nOn the one hand, empirical investigations corroborate the efficacy of predictive monitoring systems in curbing dropout rates among marginalized cohorts. By scrutinizing digital footprints—including library logins, virtual learning environment interactions, and submission timeliness—algorithms generate real-time behavioral diagnostics. Furthermore, standardized automated marking eliminates instructor fatigue and subconscious grading bias, thereby ensuring uniform evaluation metrics across vast multi-campus enrollments.\n\nOn the other hand, profound pedagogical and ethical reservations have been articulated by cognitive scientists and ethicists. Detractors argue that statistical reductionism distorts intellectual maturation, reducing nuanced scholarship to quantifiable compliance indicators. More alarmingly, opaque proprietary scoring models often perpetuate historical systemic inequities, penalizing students whose syntax or rhetorical style diverges from Eurocentric linguistic baselines. Consequently, student agency is jeopardized when academic trajectory is dictated by deterministic software without robust avenues for appeal.\n\nIn conclusion, while algorithmic evaluation indisputably enhances institutional scalability and diagnostic vigilance, it must not be permitted to supplant human instructional intuition. Moving forward, tertiary governance frameworks must mandate algorithmic transparency, regular algorithmic auditing, and human-in-the-loop oversight to ensure that pedagogical technology safeguards rather than erodes equitable scholarly development.',
      paragraphs: [
        {
          role: 'Introduction & Thesis',
          text:
            'The rapid integration of predictive analytics and automated grading within tertiary institutions has sparked a contentious discourse regarding academic integrity and pedagogy. Proponents assert that machine-learning frameworks can democratize student support by pinpointing vulnerable learners before scholastic failure ensues. Furthermore, advocates maintain that mechanized assessment alleviates the arduous grading burden borne by faculty, thereby cultivating greater bandwidth for individual mentorship. Consequently, university administrators have increasingly deployed algorithmic infrastructure across enrollment, pastoral care, and examination evaluation.',
          cohesiveDevices: ['Furthermore', 'thereby', 'Consequently']
        },
        {
          role: 'Body Paragraph 1: Supporting Contributions',
          text:
            'On the one hand, empirical investigations corroborate the efficacy of predictive monitoring systems in curbing dropout rates among marginalized cohorts. By scrutinizing digital footprints—including library logins, virtual learning environment interactions, and submission timeliness—algorithms generate real-time behavioral diagnostics. Furthermore, standardized automated marking eliminates instructor fatigue and subconscious grading bias, thereby ensuring uniform evaluation metrics across vast multi-campus enrollments.',
          cohesiveDevices: ['On the one hand', 'Furthermore', 'thereby']
        },
        {
          role: 'Body Paragraph 2: Counterarguments & Complications',
          text:
            'On the other hand, profound pedagogical and ethical reservations have been articulated by cognitive scientists and ethicists. Detractors argue that statistical reductionism distorts intellectual maturation, reducing nuanced scholarship to quantifiable compliance indicators. More alarmingly, opaque proprietary scoring models often perpetuate historical systemic inequities, penalizing students whose syntax or rhetorical style diverges from Eurocentric linguistic baselines. Consequently, student agency is jeopardized when academic trajectory is dictated by deterministic software without robust avenues for appeal.',
          cohesiveDevices: ['On the other hand', 'More alarmingly', 'Consequently']
        },
        {
          role: 'Conclusion & Synthesis',
          text:
            'In conclusion, while algorithmic evaluation indisputably enhances institutional scalability and diagnostic vigilance, it must not be permitted to supplant human instructional intuition. Moving forward, tertiary governance frameworks must mandate algorithmic transparency, regular algorithmic auditing, and human-in-the-loop oversight to ensure that pedagogical technology safeguards rather than erodes equitable scholarly development.',
          cohesiveDevices: ['In conclusion', 'while', 'Moving forward']
        }
      ]
    },
    keyVocabulary: [
      {
        term: 'contentious',
        partOfSpeech: 'adjective',
        definition: 'Causing or likely to cause an argument or intense public disagreement.',
        contextSentence: '...has sparked a contentious discourse regarding academic integrity and pedagogy.',
        collocation: 'contentious discourse / contentious debate'
      },
      {
        term: 'corroborate',
        partOfSpeech: 'verb',
        definition: 'To confirm or give support to a statement, theory, or finding with evidence.',
        contextSentence: '...empirical investigations corroborate the efficacy of predictive monitoring systems...',
        collocation: 'corroborate evidence / corroborate findings'
      },
      {
        term: 'reductionism',
        partOfSpeech: 'noun',
        definition: 'The practice of simplifying complex phenomena into oversimplified, crude components.',
        contextSentence: 'Detractors argue that statistical reductionism distorts intellectual maturation...',
        collocation: 'statistical reductionism'
      },
      {
        term: 'opaque',
        partOfSpeech: 'adjective',
        definition: 'Difficult or impossible to see through, understand, or explain clearly.',
        contextSentence: 'More alarmingly, opaque proprietary scoring models often perpetuate historical systemic inequities...',
        collocation: 'opaque models / opaque decision-making'
      },
      {
        term: 'supplant',
        partOfSpeech: 'verb',
        definition: 'To supersede and replace someone or something through force or superior influence.',
        contextSentence: '...it must not be permitted to supplant human instructional intuition.',
        collocation: 'supplant human judgment / supplant traditional methods'
      },
      {
        term: 'bandwidth',
        partOfSpeech: 'noun (figurative)',
        definition: 'The intellectual or emotional capacity needed to handle work or additional tasks.',
        contextSentence: '...cultivating greater bandwidth for individual mentorship.',
        collocation: 'cognitive bandwidth / instructional bandwidth'
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the primary thesis established in the opening paragraph?',
        questionType: 'main_idea',
        options: {
          A: 'Automated grading has universally replaced human faculty in major universities.',
          B: 'The widespread adoption of predictive algorithms in higher education has ignited significant debate regarding ethics and pedagogy.',
          C: 'Marginalized students are incapable of navigating online learning platforms without algorithms.',
          D: 'Academic integrity can only be preserved by banning artificial intelligence from universities.'
        },
        correctAnswer: 'B',
        explanation:
          'Paragraph 1 explicitly introduces the core dilemma: the rapid integration of predictive analytics and automated grading has sparked a contentious discourse regarding academic integrity and pedagogy.',
        evidenceQuote:
          'The rapid integration of predictive analytics and automated grading within tertiary institutions has sparked a contentious discourse regarding academic integrity and pedagogy.'
      },
      {
        id: 2,
        question: 'According to the second paragraph, how do predictive systems help curb university dropout rates?',
        questionType: 'detailed_fact',
        options: {
          A: 'By automatically passing students who are in financial distress.',
          B: 'By analyzing indicators like library logins and assignment timeliness to produce actionable diagnostics.',
          C: 'By lowering tuition fees for students who demonstrate high digital engagement.',
          D: 'By assigning external tutors to re-examine all failed student submissions.'
        },
        correctAnswer: 'B',
        explanation:
          'The passage notes that systems analyze digital footprints—including library logins, virtual learning environment interactions, and submission timeliness—to generate real-time behavioral diagnostics.',
        evidenceQuote:
          'By scrutinizing digital footprints—including library logins, virtual learning environment interactions, and submission timeliness—algorithms generate real-time behavioral diagnostics.'
      },
      {
        id: 3,
        question: 'In the context of paragraph 3, the term "opaque" most nearly denotes:',
        questionType: 'vocabulary_in_context',
        options: {
          A: 'Financially unprofitable.',
          B: 'Lacking transparency and difficult to scrutinize.',
          C: 'Scientifically verified and peer-reviewed.',
          D: 'Visually vibrant and aesthetically pleasing.'
        },
        correctAnswer: 'B',
        explanation:
          '"Opaque" refers to proprietary scoring models that cannot be inspected, understood, or held accountable from the outside.',
        evidenceQuote:
          'More alarmingly, opaque proprietary scoring models often perpetuate historical systemic inequities...'
      },
      {
        id: 4,
        question: 'What can be inferred from the author\'s warning regarding "Eurocentric linguistic baselines"?',
        questionType: 'inferential_logic',
        options: {
          A: 'Standardized algorithms may unjustly penalize students whose linguistic patterns reflect non-Western dialects or traditions.',
          B: 'European university curriculums are superior to global alternatives.',
          C: 'Automated grading is strictly illegal in continental Europe.',
          D: 'Native English speakers never experience grading bias in automated assessments.'
        },
        correctAnswer: 'A',
        explanation:
          'The text highlights that models trained solely on Eurocentric baselines penalize students whose syntax or rhetorical styles diverge from that specific standard, causing disparate impact.',
        evidenceQuote:
          '...penalizing students whose syntax or rhetorical style diverges from Eurocentric linguistic baselines.'
      },
      {
        id: 5,
        question: 'Which course of action does the author endorse in the concluding paragraph?',
        questionType: 'main_idea',
        options: {
          A: 'A total prohibition of algorithmic software across all academic disciplines.',
          B: 'Immediate full automation of university entrance exams and thesis defenses.',
          C: 'Retaining human-in-the-loop oversight and demanding mandatory auditing and transparency.',
          D: 'Delegating all university governance decisions to autonomous machine learning agents.'
        },
        correctAnswer: 'C',
        explanation:
          'The conclusion states that tertiary frameworks must mandate algorithmic transparency, regular auditing, and human-in-the-loop oversight rather than allowing tech to supplant human intuition.',
        evidenceQuote:
          'Moving forward, tertiary governance frameworks must mandate algorithmic transparency, regular algorithmic auditing, and human-in-the-loop oversight...'
      }
    ],
    examinerNotes: {
      academicToneSummary:
        'Features formal register, nominalizations ("statistical reductionism", "diagnostic vigilance"), and balanced argumentative structure.',
      targetLexicalBandFeatures: [
        'C1/C2 Academic Collocations: contentious discourse, empirical investigations, behavioral diagnostics, systemic inequities',
        'Cohesion: High-band discourse markers bridging concessive and additive logic (On the one hand, On the other hand, Consequently, In conclusion)'
      ]
    }
  },
  {
    title: 'Urban Rewilding: Reconciling Ecosystem Restoration and High-Density Metropolises',
    targetLevel: 'IELTS Band 7.0 / CEFR C1',
    structureType: 'Argumentative Pros/Cons',
    topic: 'Biodiversity and Urban Planning',
    wordCount: 298,
    readingText: {
      fullText:
        'In an era characterized by accelerating climate volatility, municipal urban planners are increasingly adopting "urban rewilding" as a regenerative design paradigm. Unlike manicured municipal parks, rewilding deliberately reintroduces native flora and fauna into metropolitan corridors to reconstruct autonomous ecological processes. Proponents maintain that this intervention mitigates catastrophic flash flooding through enhanced soil permeability while curbing oppressive urban heat-island effects. Consequently, progressive municipalities across Europe and Asia have transformed decommissioned industrial rail lines and vacant docklands into biodiverse vegetative sanctuaries.\n\nOn the one hand, the measurable socio-environmental dividends of urban rewilding are well documented by urban ecologists. Restoring canopy coverage and native wetlands substantially reduces metropolitan surface temperatures by up to four degrees Celsius. Furthermore, empirical psychological surveys reveal that continuous exposure to structurally diverse greenery dramatically diminishes cortisol levels among urban dwellers, thereby fostering psychological resilience and community cohesion.\n\nOn the other hand, the spontaneous, uncontrolled ethos of rewilding frequently collides with traditional municipal imperatives and public safety concerns. Skeptics point out that unchecked shrubbery and marshlands can harbor vector-borne pathogens, such as ticks and mosquitoes, posing genuine public health hazards. Furthermore, conservative property developers contend that unkempt, unmanicured wilderness corridors depress surrounding commercial real estate valuations and create navigational hazards for vehicular traffic. Consequently, municipal assemblies frequently encounter vigorous pushback from resident associations demanding manicured safety over ecological autonomy.\n\nIn conclusion, while urban rewilding inevitably disrupts conventional civic aesthetics and demands novel risk-mitigation protocols, its ecological indispensability is undeniable. Urban administrations must therefore forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones, thereby harmonizing metropolitan prosperity with ecological resilience.',
      paragraphs: [
        {
          role: 'Introduction & Thesis',
          text:
            'In an era characterized by accelerating climate volatility, municipal urban planners are increasingly adopting "urban rewilding" as a regenerative design paradigm. Unlike manicured municipal parks, rewilding deliberately reintroduces native flora and fauna into metropolitan corridors to reconstruct autonomous ecological processes. Proponents maintain that this intervention mitigates catastrophic flash flooding through enhanced soil permeability while curbing oppressive urban heat-island effects. Consequently, progressive municipalities across Europe and Asia have transformed decommissioned industrial rail lines and vacant docklands into biodiverse vegetative sanctuaries.',
          cohesiveDevices: ['Unlike', 'while', 'Consequently']
        },
        {
          role: 'Body Paragraph 1: Environmental & Social Benefits',
          text:
            'On the one hand, the measurable socio-environmental dividends of urban rewilding are well documented by urban ecologists. Restoring canopy coverage and native wetlands substantially reduces metropolitan surface temperatures by up to four degrees Celsius. Furthermore, empirical psychological surveys reveal that continuous exposure to structurally diverse greenery dramatically diminishes cortisol levels among urban dwellers, thereby fostering psychological resilience and community cohesion.',
          cohesiveDevices: ['On the one hand', 'Furthermore', 'thereby']
        },
        {
          role: 'Body Paragraph 2: Civic & Commercial Challenges',
          text:
            'On the other hand, the spontaneous, uncontrolled ethos of rewilding frequently collides with traditional municipal imperatives and public safety concerns. Skeptics point out that unchecked shrubbery and marshlands can harbor vector-borne pathogens, such as ticks and mosquitoes, posing genuine public health hazards. Furthermore, conservative property developers contend that unkempt, unmanicured wilderness corridors depress surrounding commercial real estate valuations and create navigational hazards for vehicular traffic. Consequently, municipal assemblies frequently encounter vigorous pushback from resident associations demanding manicured safety over ecological autonomy.',
          cohesiveDevices: ['On the other hand', 'Furthermore', 'Consequently']
        },
        {
          role: 'Conclusion & Synthesis',
          text:
            'In conclusion, while urban rewilding inevitably disrupts conventional civic aesthetics and demands novel risk-mitigation protocols, its ecological indispensability is undeniable. Urban administrations must therefore forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones, thereby harmonizing metropolitan prosperity with ecological resilience.',
          cohesiveDevices: ['In conclusion', 'while', 'therefore', 'thereby']
        }
      ]
    },
    keyVocabulary: [
      {
        term: 'regenerative',
        partOfSpeech: 'adjective',
        definition: 'Relating to or causing the renewal, restoration, or revitalisation of an ecosystem or process.',
        contextSentence: '...adopting "urban rewilding" as a regenerative design paradigm.',
        collocation: 'regenerative design / regenerative agriculture'
      },
      {
        term: 'permeability',
        partOfSpeech: 'noun',
        definition: 'The state or quality of a material or soil that allows liquids or gases to pass through it.',
        contextSentence: '...mitigates catastrophic flash flooding through enhanced soil permeability...',
        collocation: 'soil permeability / surface permeability'
      },
      {
        term: 'dividends',
        partOfSpeech: 'noun (plural figurative)',
        definition: 'A desirable result or unexpected positive consequence of an action or investment.',
        contextSentence: 'On the one hand, the measurable socio-environmental dividends of urban rewilding...',
        collocation: 'reap dividends / yield dividends'
      },
      {
        term: 'pathogens',
        partOfSpeech: 'noun (plural)',
        definition: 'Biological agents, such as bacteria, viruses, or parasites, that cause disease in hosts.',
        contextSentence: '...can harbor vector-borne pathogens, such as ticks and mosquitoes...',
        collocation: 'vector-borne pathogens / infectious pathogens'
      },
      {
        term: 'indispensability',
        partOfSpeech: 'noun',
        definition: 'The quality of being absolutely necessary, essential, or impossible to manage without.',
        contextSentence: '...its ecological indispensability is undeniable.',
        collocation: 'absolute indispensability'
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'What distinguishes urban rewilding from conventional city parks according to Paragraph 1?',
        questionType: 'detailed_fact',
        options: {
          A: 'Rewilding projects rely exclusively on imported ornamental plants.',
          B: 'Rewilding restores native flora and fauna to establish autonomous, self-sustaining ecological dynamics.',
          C: 'Rewilding spaces are strictly closed to the human public at all times.',
          D: 'Rewilding requires constant mechanical mowing and pesticide treatments.'
        },
        correctAnswer: 'B',
        explanation:
          'Paragraph 1 contrasts manicured parks with rewilding, which intentionally reintroduces native flora and fauna to reconstruct autonomous ecological processes.',
        evidenceQuote:
          'Unlike manicured municipal parks, rewilding deliberately reintroduces native flora and fauna into metropolitan corridors to reconstruct autonomous ecological processes.'
      },
      {
        id: 2,
        question: 'Which of the following is highlighted as a psychological benefit of rewilded urban spaces?',
        questionType: 'detailed_fact',
        options: {
          A: 'Immediate elimination of commercial traffic congestion.',
          B: 'A marked reduction in stress-related cortisol levels among inhabitants.',
          C: 'Guaranteed increases in residential real estate sales.',
          D: 'Complete immunity against airborne respiratory viruses.'
        },
        correctAnswer: 'B',
        explanation:
          'The text highlights that continuous exposure to structurally diverse greenery dramatically diminishes cortisol levels among urban dwellers.',
        evidenceQuote:
          '...continuous exposure to structurally diverse greenery dramatically diminishes cortisol levels among urban dwellers...'
      },
      {
        id: 3,
        question: 'Why do certain property developers and residents oppose unmanaged wilderness corridors?',
        questionType: 'detailed_fact',
        options: {
          A: 'They fear property depreciation and the harboring of disease-carrying vectors like ticks.',
          B: 'They believe trees increase solar radiation and thermal heat islands.',
          C: 'They want all open spaces converted exclusively into heavy industrial factories.',
          D: 'They argue that native birds cause structural damage to concrete foundations.'
        },
        correctAnswer: 'A',
        explanation:
          'Opponents cite public health hazards from vector-borne pathogens and property developers contend that unkempt corridors depress commercial valuations.',
        evidenceQuote:
          'Skeptics point out that unchecked shrubbery and marshlands can harbor vector-borne pathogens... property developers contend that unkempt, unmanicured wilderness corridors depress surrounding commercial real estate valuations...'
      },
      {
        id: 4,
        question: 'The author\'s final recommendation in Paragraph 4 proposes:',
        questionType: 'main_idea',
        options: {
          A: 'Completely paving over all remaining metropolitan vegetative areas.',
          B: 'Adopting hybrid approaches that balance biological diversity with designated safety parameters.',
          C: 'Ignoring all resident concerns regarding vector-borne illnesses.',
          D: 'Restricting rewilding to remote rural regions outside metropolitan boundaries.'
        },
        correctAnswer: 'B',
        explanation:
          'The author urges municipal administrations to forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones.',
        evidenceQuote:
          'Urban administrations must therefore forge hybrid municipal designs that balance uninhibited biodiversity with structured public safety zones...'
      },
      {
        id: 5,
        question: 'In paragraph 3, the phrase "vector-borne pathogens" refers to:',
        questionType: 'vocabulary_in_context',
        options: {
          A: 'Chemical contaminants leaching from old train rails.',
          B: 'Infectious disease-causing agents transmitted through organisms like insects.',
          C: 'Structural weaknesses in elevated urban footbridges.',
          D: 'Legal regulations imposed by regional health ministries.'
        },
        correctAnswer: 'B',
        explanation:
          'The text clarifies vector-borne pathogens with the examples "such as ticks and mosquitoes", which transmit diseases.',
        evidenceQuote:
          '...can harbor vector-borne pathogens, such as ticks and mosquitoes, posing genuine public health hazards.'
      }
    ],
    examinerNotes: {
      academicToneSummary:
        'Exemplary environmental science reading module demonstrating CEFR C1 vocabulary (permeability, regenerative, indispensability) and cause-effect cohesion.',
      targetLexicalBandFeatures: [
        'Precise Environmental Terminology: soil permeability, heat-island effect, autonomous ecological processes, vector-borne pathogens',
        'Cohesive Linkers: In an era characterized by, On the one hand, On the other hand, Consequently, In conclusion, therefore'
      ]
    }
  },
  {
    title: 'The Clockmaker of Edinburgh and the Suspended Hour',
    targetLevel: 'IELTS Band 7.5 / CEFR C1',
    structureType: 'Tema Libre / Cuento o Relato (Narrative Story Break)',
    topic: 'An antique clockmaking workshop and a curious temporal encounter in 19th-century Edinburgh',
    wordCount: 297,
    readingText: {
      fullText:
        'Deep within the labyrinthine alleyways of Edinburgh’s Old Town, Angus Macintyre tended his workshop amidst a chorus of rhythmic ticking. Outside, thick sea mist crept through the wynds, yet within his sanctum of brass and mahogany, time was treated as a malleable medium. Angus, having spent decades calibrating delicate escapements, possessed an uncanny instinct for chronometers. Consequently, eccentric collectors frequented his dimly lit atelier, seeking counsel on mechanisms that defied conventional mechanics.\n\nOn a tempestuous November twilight, an enigmatic stranger wrapped in a woollen cloak crossed the threshold, clutching an ornate silver timepiece. Without uttering a greeting, the visitor placed the tarnished contraption onto the workbench, whispering that its hands moved only when its observer remained motionless. Although initially skeptical, Angus scrutinized the escapement through his brass loupe. To his sheer astonishment, the balance wheel oscillated backwards, emitting a melodious resonance that seemed to suspend the ambient drafts within the room.\n\nSuddenly, the heavy clocks lining the perimeter fell into profound silence, their pendulums paralyzed mid-swing. For several fleeting moments, the bustling clamor of carriages upon the cobblestones outside evaporated into ethereal stillness. In that suspended vacuum, Angus perceived the faint aroma of summer heather and heard the distant tolling of a cathedral bell destroyed decades prior. Nevertheless, before he could articulate his bewilderment, the stranger gently turned a knurled dial, instantly releasing the room back into chronological motion.\n\nBefore Angus could speak, the stranger vanished into the foggy night, leaving the anomalous clock behind. In retrospect, the artisan never attempted to dismantle the artefact, choosing instead to let it rest upon his mantlepiece. Consequently, whenever modern visitors dismiss the poetic unpredictability of existence, Angus smiles at his quiet gallery, well aware that certain ephemeral wonders can never be measured by mere mechanical gears.',
      paragraphs: [
        {
          role: 'Scene 1: Setting & Atmosphere',
          text:
            'Deep within the labyrinthine alleyways of Edinburgh’s Old Town, Angus Macintyre tended his workshop amidst a chorus of rhythmic ticking. Outside, thick sea mist crept through the wynds, yet within his sanctum of brass and mahogany, time was treated as a malleable medium. Angus, having spent decades calibrating delicate escapements, possessed an uncanny instinct for chronometers. Consequently, eccentric collectors frequented his dimly lit atelier, seeking counsel on mechanisms that defied conventional mechanics.',
          cohesiveDevices: ['Outside', 'yet within', 'Consequently']
        },
        {
          role: 'Scene 2: Narrative Ascent & The Curious Mechanism',
          text:
            'On a tempestuous November twilight, an enigmatic stranger wrapped in a woollen cloak crossed the threshold, clutching an ornate silver timepiece. Without uttering a greeting, the visitor placed the tarnished contraption onto the workbench, whispering that its hands moved only when its observer remained motionless. Although initially skeptical, Angus scrutinized the escapement through his brass loupe. To his sheer astonishment, the balance wheel oscillated backwards, emitting a melodious resonance that seemed to suspend the ambient drafts within the room.',
          cohesiveDevices: ['Without uttering', 'Although initially', 'To his sheer astonishment']
        },
        {
          role: 'Scene 3: Climax & Turning Point',
          text:
            'Suddenly, the heavy clocks lining the perimeter fell into profound silence, their pendulums paralyzed mid-swing. For several fleeting moments, the bustling clamor of carriages upon the cobblestones outside evaporated into ethereal stillness. In that suspended vacuum, Angus perceived the faint aroma of summer heather and heard the distant tolling of a cathedral bell destroyed decades prior. Nevertheless, before he could articulate his bewilderment, the stranger gently turned a knurled dial, instantly releasing the room back into chronological motion.',
          cohesiveDevices: ['Suddenly', 'For several fleeting moments', 'In that suspended vacuum', 'Nevertheless']
        },
        {
          role: 'Scene 4: Resolution & Lingering Reflection',
          text:
            'Before Angus could speak, the stranger vanished into the foggy night, leaving the anomalous clock behind. In retrospect, the artisan never attempted to dismantle the artefact, choosing instead to let it rest upon his mantlepiece. Consequently, whenever modern visitors dismiss the poetic unpredictability of existence, Angus smiles at his quiet gallery, well aware that certain ephemeral wonders can never be measured by mere mechanical gears.',
          cohesiveDevices: ['Before', 'In retrospect', 'Consequently', 'well aware that']
        }
      ]
    },
    keyVocabulary: [
      {
        term: 'labyrinthine',
        partOfSpeech: 'adjective',
        definition: 'Irregular, intricate, and twisting like a maze or labyrinth.',
        contextSentence: 'Deep within the labyrinthine alleyways of Edinburgh’s Old Town...',
        collocation: 'labyrinthine alleyways / labyrinthine network'
      },
      {
        term: 'malleable',
        partOfSpeech: 'adjective',
        definition: 'Capable of being shaped, altered, or adapted through influence or craft.',
        contextSentence: '...time was treated as a malleable medium rather than an absolute tyrant.',
        collocation: 'malleable medium / malleable concept'
      },
      {
        term: 'enigmatic',
        partOfSpeech: 'adjective',
        definition: 'Mysterious, puzzling, and difficult to comprehend or interpret.',
        contextSentence: 'On a tempestuous November twilight, an enigmatic stranger wrapped in a woollen cloak...',
        collocation: 'enigmatic stranger / enigmatic smile'
      },
      {
        term: 'resonance',
        partOfSpeech: 'noun',
        definition: 'The quality in a sound of being deep, full, and reverberating; also evocative emotional depth.',
        contextSentence: '...emitting a melodious resonance that seemed to suspend the ambient drafts...',
        collocation: 'melodious resonance / profound resonance'
      },
      {
        term: 'ephemeral',
        partOfSpeech: 'adjective',
        definition: 'Lasting for a remarkably brief or fleeting period; transient and precious.',
        contextSentence: '...well aware that certain ephemeral wonders can never be measured by mere mechanical gears.',
        collocation: 'ephemeral wonders / ephemeral moments'
      }
    ],
    quiz: [
      {
        id: 1,
        question: 'What is the central narrative focus of the passage?',
        questionType: 'main_idea',
        options: {
          A: 'A technical debate regarding gear durability in industrial steam machinery.',
          B: 'An artisan clockmaker’s encounter with an anomalous silver timepiece that temporarily suspends his perception of time.',
          C: 'A historical census documenting antique retailers along Edinburgh’s Royal Mile.',
          D: 'A legal dispute over the copyright of Swiss pocket watches.'
        },
        correctAnswer: 'B',
        explanation:
          'The passage tells the story of Angus Macintyre, an Edinburgh clockmaker, who receives a strange silver timepiece that causes time and noise to momentarily freeze.',
        evidenceQuote:
          'On a tempestuous November twilight, an enigmatic stranger... clutching an ornate silver timepiece... To his sheer astonishment, the balance wheel oscillated backwards...'
      },
      {
        id: 2,
        question: 'According to Paragraph 2, what unusual phenomenon occurred when Angus inspected the clock mechanism?',
        questionType: 'detailed_fact',
        options: {
          A: 'The wooden workbench caught fire from electrical sparks.',
          B: 'The balance wheel oscillated backwards and produced a melodious resonance.',
          C: 'The dials melted into liquid silver under the lamplight.',
          D: 'The timepiece chimed twelve times in rapid succession.'
        },
        correctAnswer: 'B',
        explanation:
          'The text states that Angus was astonished because the balance wheel oscillated backwards and emitted a melodious resonance.',
        evidenceQuote:
          'To his sheer astonishment, the balance wheel oscillated backwards, emitting a melodious resonance that seemed to suspend the ambient drafts within the room.'
      },
      {
        id: 3,
        question: 'What sensory details did Angus experience during the suspended vacuum described in Paragraph 3?',
        questionType: 'detailed_fact',
        options: {
          A: 'The sharp taste of salt water and screaming seagulls.',
          B: 'The fragrance of summer heather and the chime of a cathedral bell destroyed decades earlier.',
          C: 'Absolute pitch darkness accompanied by cold torrential rain indoors.',
          D: 'Loud brass trumpet music playing from an empty street.'
        },
        correctAnswer: 'B',
        explanation:
          'During the momentary freeze, Angus experienced the smell of summer heather and heard the chime of a cathedral bell that had been destroyed thirty years before.',
        evidenceQuote:
          'In that suspended vacuum, Angus perceived the faint aroma of summer heather and heard the distant tolling of a cathedral bell destroyed decades prior.'
      },
      {
        id: 4,
        question: 'In Paragraph 1, why does the author describe time as a "malleable medium"?',
        questionType: 'vocabulary_in_context',
        options: {
          A: 'To indicate that metal clocks were fragile and melted in the workshop heat.',
          B: 'To convey that within the workshop, time was felt to be flexible and shaped by craftsmanship rather than rigid.',
          C: 'To illustrate that Angus only accepted malleable gold coins as payment.',
          D: 'To explain why Edinburgh clockmakers frequently arrived late for public lectures.'
        },
        correctAnswer: 'B',
        explanation:
          'The word "malleable" (shapeable, adaptable) contrasts with "an absolute tyrant", conveying that time inside the artisan workshop was treated as flexible and artistic.',
        evidenceQuote:
          '...yet within his sanctum of brass and mahogany, time was treated as a malleable medium.'
      },
      {
        id: 5,
        question: 'What does Angus’s decision to leave the clock on his mantlepiece imply about his character in Paragraph 4?',
        questionType: 'inferential_logic',
        options: {
          A: 'He was too lazy to unscrew the mechanism and sell the silver parts.',
          B: 'He revered the mystery and recognized that not all life experiences can be reduced to cold mechanical analysis.',
          C: 'He planned to return it to the municipal police station the following morning.',
          D: 'He was waiting for a wealthier foreign collector to make an auction offer.'
        },
        correctAnswer: 'B',
        explanation:
          'Angus kept the intact clock as a testament to the poetic unpredictability of existence, understanding that certain ephemeral wonders exceed mechanical gears.',
        evidenceQuote:
          '...the artisan never attempted to dismantle the artefact, choosing instead to let it rest upon his mantlepiece... well aware that certain ephemeral wonders can never be measured by mere mechanical gears.'
      }
    ],
    examinerNotes: {
      academicToneSummary:
        'A literary narrative module calibrated to CEFR C1 / IELTS Band 7.5. Offers an engaging narrative break while cultivating advanced descriptive vocabulary (labyrinthine, enigmatic, malleable, ephemeral) and narrative cohesive discourse.',
      targetLexicalBandFeatures: [
        'Literary & Atmospheric Collocations: labyrinthine alleyways, malleable medium, enigmatic stranger, anomalous clock, ethereal stillness, ephemeral wonders',
        'Narrative Discourse Devices: Outside, yet within, Consequently, Although initially, To his sheer astonishment, In that suspended vacuum, Nevertheless, In retrospect'
      ]
    }
  }
];
