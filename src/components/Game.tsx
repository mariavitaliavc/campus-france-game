import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Star, Trophy, Target, Clock, AlertTriangle, Brain, Zap, Flame } from 'lucide-react';

const CampusFranceGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [gameMode, setGameMode] = useState('menu');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const questions = [
    // NIVEAU 1 - Questions de base
    {
      level: 1,
      type: 'multiple_choice',
      question: "Présentez-vous brièvement",
      options: [
        "Je suis étudiant, j'aime voyager",
        "Je suis [nom], titulaire d'un [diplôme], passionné par [domaine], avec un projet professionnel clair",
        "Je viens de [pays] et je veux étudier en France",
        "Je suis intelligent et motivé"
      ],
      correct: 1,
      explanation: "Excellent ! Une présentation doit être structurée : identité, parcours, passion, projet. Évitez les généralités.",
      points: 15
    },
    {
      level: 1,
      type: 'multiple_choice',
      question: "Pourquoi avez-vous choisi le BTS Comptabilité et Gestion ?",
      options: [
        "C'est facile à obtenir",
        "C'est une formation professionnalisante qui s'inscrit dans mon projet d'expertise comptable",
        "Mes parents l'ont choisi pour moi",
        "C'est moins cher que d'autres formations"
      ],
      correct: 1,
      explanation: "Parfait ! Vous montrez un choix réfléchi en lien avec vos objectifs professionnels à long terme.",
      points: 15
    },
    {
      level: 1,
      type: 'multiple_choice',
      question: "Pourquoi la France plutôt qu'un autre pays ?",
      options: [
        "J'aime la culture française",
        "Excellence académique du système français + expérience antérieure avec l'Université du Mans",
        "C'est plus facile d'avoir un visa",
        "Paris est une belle ville"
      ],
      correct: 1,
      explanation: "Excellent ! Vous valorisez la qualité académique et montrez votre connaissance du système français.",
      points: 15
    },
    {
      level: 1,
      type: 'open_ended',
      question: "Décrivez votre parcours scolaire (vous avez 90 secondes)",
      timeLimit: 90,
      keyPoints: ['Bac B économie', 'Formation génie informatique', 'D.U. Macroéconomie', 'Réorientation comptabilité', 'Cohérence du parcours'],
      explanation: "Bien ! Montrez la cohérence de votre parcours vers la comptabilité malgré les réorientations.",
      points: 20
    },
    
    // NIVEAU 2 - Questions approfondies
    {
      level: 2,
      type: 'multiple_choice',
      question: "Quel est votre projet professionnel précis ?",
      options: [
        "Trouver un bon travail",
        "BTS → DCG → DSCG → Expert-comptable avec spécialisation fiscale",
        "Voir après mes études",
        "Créer une entreprise"
      ],
      correct: 1,
      explanation: "Parfait ! Un projet structuré avec étapes claires et spécialisation montre votre sérieux.",
      points: 20
    },
    {
      level: 2,
      type: 'scenario',
      question: "L'agent vous dit : 'Votre parcours montre des changements d'orientation. Comment être sûr que vous ne changerez pas encore ?'",
      options: [
        "J'ai mûri maintenant",
        "Mes expériences passées ont confirmé mon intérêt pour la comptabilité-gestion",
        "Je vous promets que non",
        "C'est différent cette fois"
      ],
      correct: 1,
      explanation: "Excellent ! Vous transformez un point faible en force en montrant comment vos expériences vous ont guidé.",
      points: 25
    },
    {
      level: 2,
      type: 'open_ended',
      question: "Pourquoi spécifiquement le Lycée Beaupeyrat à Limoges ?",
      keyPoints: ['Recherche approfondie', 'Qualité pédagogique', 'Encadrement personnalisé', 'Taux de réussite', 'Ville adaptée'],
      explanation: "Bien ! Montrez que vous avez fait des recherches approfondies sur l'établissement.",
      points: 20
    },
    {
      level: 2,
      type: 'multiple_choice',
      question: "Comment comptez-vous financer vos études ?",
      options: [
        "Mes parents paieront",
        "Soutien familial de X€/mois + budget logement Y€ + garant en France + jobs étudiants",
        "Je trouverai un moyen",
        "J'espère avoir une bourse"
      ],
      correct: 1,
      explanation: "Parfait ! Détails précis et crédibles avec plusieurs sources de financement.",
      points: 20
    },
    
    // NIVEAU 3 - Questions piège et complexes
    {
      level: 3,
      type: 'pressure_test',
      question: "QUESTION PIÈGE : Quelles villes françaises vous intéressent et pourquoi ?",
      options: [
        "Paris parce que c'est la capitale",
        "Limoges pour mes études, puis des villes avec des cabinets comptables renommés",
        "Toutes les villes françaises sont bien",
        "Je ne sais pas encore"
      ],
      correct: 1,
      explanation: "Excellent ! Vous montrez que c'est la formation qui guide votre choix, pas le tourisme.",
      points: 30
    },
    {
      level: 3,
      type: 'scenario',
      question: "L'agent insiste : 'Votre projet semble ambitieux. Et si vous échouez ?'",
      options: [
        "Je ne peux pas échouer",
        "J'analyserai les causes et m'adapterai : redoublement, formation complémentaire, ou réorientation raisonnée",
        "Je rentrerai dans mon pays",
        "J'essaierai autre chose"
      ],
      correct: 1,
      explanation: "Parfait ! Vous montrez maturité et capacité d'adaptation tout en restant déterminé.",
      points: 30
    },
    {
      level: 3,
      type: 'open_ended',
      question: "Que connaissez-vous du système éducatif français ?",
      keyPoints: ['LMD', 'Contrôle continu', 'Stages obligatoires', 'Diplômes reconnus', 'Exigence académique'],
      explanation: "Bien ! Montrez votre connaissance concrète du système français.",
      points: 25
    },
    {
      level: 3,
      type: 'rapid_fire',
      question: "RAPID FIRE : Citez 5 qualités indispensables pour un expert-comptable",
      keyPoints: ['Rigueur', 'Précision', 'Discrétion', 'Analyse', 'Organisation', 'Éthique', 'Communication'],
      explanation: "Excellent ! Ces qualités correspondent parfaitement au profil recherché.",
      points: 25
    },
    
    // NIVEAU 4 - Pression maximale
    {
      level: 4,
      type: 'pressure_test',
      question: "STRESS TEST : Vous avez 30 secondes - Pourquoi vous plutôt qu'un autre candidat ?",
      options: [
        "Je suis meilleur que les autres",
        "Parcours atypique + expérience macro-économie + projet clair + motivation prouvée",
        "Je travaille plus dur",
        "J'ai de meilleures notes"
      ],
      correct: 1,
      explanation: "Parfait ! Vous valorisez votre singularité sans dénigrer les autres.",
      points: 35
    },
    {
      level: 4,
      type: 'scenario',
      question: "L'agent vous provoque : 'Vous ne pensez pas que l'expertise comptable est un métier ennuyeux ?'",
      options: [
        "Non, pas du tout",
        "Au contraire, c'est un métier en évolution constante : digitalisation, conseil, analyse financière",
        "Chacun son opinion",
        "Il faut bien vivre"
      ],
      correct: 1,
      explanation: "Excellent ! Vous montrez votre connaissance moderne du métier et votre passion.",
      points: 35
    },
    {
      level: 4,
      type: 'open_ended',
      question: "Décrivez précisément votre programme d'études en France année par année",
      keyPoints: ['BTS 2 ans', 'DCG 3 ans', 'DSCG 2 ans', 'Stage expertise', 'Spécialisation', 'Calendrier réaliste'],
      explanation: "Parfait ! Votre planification détaillée montre votre sérieux et votre préparation.",
      points: 30
    },
    {
      level: 4,
      type: 'ultimate_test',
      question: "QUESTION ULTIME : L'agent reste silencieux 10 secondes puis dit : 'Convainquez-moi en 1 minute'",
      keyPoints: ['Parcours cohérent', 'Projet structuré', 'Motivation sincère', 'Préparation sérieuse', 'Valeur ajoutée'],
      explanation: "Extraordinaire ! Vous savez synthétiser votre valeur sous pression.",
      points: 40
    },
    
    // NIVEAU 5 - Maîtrise totale
    {
      level: 5,
      type: 'cultural_test',
      question: "Que savez-vous de l'actualité économique française récente ?",
      keyPoints: ['Réformes fiscales', 'Secteur comptable', 'Digitalisation', 'Évolution réglementaire', 'Marché emploi'],
      explanation: "Impressionnant ! Votre connaissance de l'actualité montre votre engagement.",
      points: 35
    },
    {
      level: 5,
      type: 'ethics_test',
      question: "Un client vous demande d'arranger ses comptes. Que faites-vous ?",
      options: [
        "J'accepte pour garder le client",
        "Refus catégorique + explication des risques + proposition d'alternatives légales",
        "J'hésite selon le montant",
        "Je demande conseil"
      ],
      correct: 1,
      explanation: "Parfait ! Vous montrez votre intégrité et votre compréhension de la déontologie.",
      points: 40
    },
    {
      level: 5,
      type: 'innovation_test',
      question: "Comment voyez-vous l'évolution du métier de comptable avec l'IA ?",
      keyPoints: ['Transformation digitale', 'Conseil stratégique', 'Analyse prédictive', 'Formation continue', 'Valeur ajoutée humaine'],
      explanation: "Exceptionnel ! Vous montrez une vision moderne et prospective du métier.",
      points: 35
    }
  ];

  const levels = [
    { name: "Découverte", description: "Questions de base essentielles", icon: "🎯", color: "bg-blue-500" },
    { name: "Approfondissement", description: "Projet et motivation", icon: "🎓", color: "bg-green-500" },
    { name: "Complexité", description: "Pièges et scénarios", icon: "🧠", color: "bg-yellow-500" },
    { name: "Pression", description: "Stress et provocation", icon: "🔥", color: "bg-red-500" },
    { name: "Maîtrise", description: "Excellence totale", icon: "👑", color: "bg-purple-500" }
  ];

  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const evaluateAnswer = (answer, keyPoints) => {
    const words = answer.toLowerCase().split(/\s+/);
    const matchedPoints = keyPoints.filter(point => 
      words.some(word => point.toLowerCase().includes(word.toLowerCase()) || 
                          word.includes(point.toLowerCase().substring(0, 4)))
    );
    
    const wordCount = words.length;
    const quality = matchedPoints.length / keyPoints.length;
    
    let score = 0;
    let feedback = "";
    
    if (quality >= 0.8 && wordCount >= 20) {
      score = 5;
      feedback = "🏆 EXCELLENT ! Réponse complète et bien structurée";
    } else if (quality >= 0.6 && wordCount >= 15) {
      score = 4;
      feedback = "👍 TRÈS BIEN ! Quelques détails à ajouter";
    } else if (quality >= 0.4 && wordCount >= 10) {
      score = 3;
      feedback = "✅ BIEN ! Réponse correcte mais perfectible";
    } else if (quality >= 0.2 || wordCount >= 5) {
      score = 2;
      feedback = "⚠️ INSUFFISANT ! Réponse trop superficielle";
    } else {
      score = 1;
      feedback = "❌ FAIBLE ! Réponse inadéquate";
    }
    
    return { score, feedback, matchedPoints };
  };

  const startGame = (level) => {
    setCurrentLevel(level);
    setGameMode('playing');
    setCurrentQuestion(0);
    setScore(0);
    setLives(3);
    setShowAnswer(false);
    setStreak(0);
    const firstQuestion = questions.filter(q => q.level === level)[0];
    setTimeLeft(firstQuestion?.timeLimit || 60);
    setIsTimerActive(true);
    setUserAnswer('');
    setFeedback('');
  };

  const handleAnswer = (selectedAnswer) => {
    const question = questions.filter(q => q.level === currentLevel)[currentQuestion];
    
    if (question.type === 'multiple_choice' || question.type === 'scenario' || question.type === 'pressure_test') {
      if (selectedAnswer === question.correct) {
        const bonusPoints = streak >= 3 ? 10 : 0;
        const totalPoints = (question.points || 15) + bonusPoints;
        setScore(score + totalPoints);
        setStreak(streak + 1);
        setFeedback(`🎉 CORRECT ! +${totalPoints} points ${bonusPoints > 0 ? '(+10 bonus série)' : ''}\n${question.explanation}`);
      } else {
        setLives(lives - 1);
        setStreak(0);
        setFeedback(`❌ INCORRECT. ${question.explanation}`);
      }
    }
    
    setShowAnswer(true);
    setIsTimerActive(false);
  };

  const handleOpenEndedSubmit = () => {
    const question = questions.filter(q => q.level === currentLevel)[currentQuestion];
    const evaluation = evaluateAnswer(userAnswer, question.keyPoints);
    
    if (evaluation.score >= 3) {
      const bonusPoints = streak >= 3 ? 10 : 0;
      const totalPoints = (question.points || 20) + bonusPoints;
      setScore(score + totalPoints);
      setStreak(streak + 1);
      setFeedback(`${evaluation.feedback}\n+${totalPoints} points ${bonusPoints > 0 ? '(+10 bonus série)' : ''}\nPoints clés trouvés: ${evaluation.matchedPoints.join(', ')}\n${question.explanation}`);
    } else {
      setLives(lives - 1);
      setStreak(0);
      setFeedback(`${evaluation.feedback}\nPoints clés manqués: ${question.keyPoints.filter(p => !evaluation.matchedPoints.includes(p)).join(', ')}\n${question.explanation}`);
    }
    
    setShowAnswer(true);
    setIsTimerActive(false);
  };

  const nextQuestion = () => {
    const levelQuestions = questions.filter(q => q.level === currentLevel);
    if (currentQuestion < levelQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      const nextQ = levelQuestions[currentQuestion + 1];
      setTimeLeft(nextQ?.timeLimit || 60);
      setIsTimerActive(true);
      setUserAnswer('');
      setFeedback('');
    } else {
      setGameMode('results');
      setIsTimerActive(false);
      if (score > bestScore) {
        setBestScore(score);
      }
    }
  };

  const handleTimeUp = () => {
    setLives(lives - 1);
    setStreak(0);
    setFeedback('⏰ TEMPS ÉCOULÉ ! En entretien réel, il faut répondre rapidement et avec assurance.');
    setShowAnswer(true);
    setIsTimerActive(false);
  };

  const resetGame = () => {
    setGameMode('menu');
    setCurrentLevel(1);
    setScore(0);
    setLives(3);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setTimeLeft(60);
    setIsTimerActive(false);
    setUserAnswer('');
    setFeedback('');
    setStreak(0);
  };

  if (gameMode === 'menu') {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-indigo-800 mb-4">🎓 Campus France Master Elite</h1>
          <p className="text-xl text-gray-700 mb-2">Formation complète à l'entretien Campus France</p>
          <p className="text-lg text-indigo-600">Basé sur +50 questions réelles • Évaluation intelligente • Coaching personnalisé</p>
          {bestScore > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg inline-block">
              <Trophy className="inline mr-2 text-yellow-600" size={20} />
              <span className="text-yellow-800 font-semibold">Meilleur Score: {bestScore} points</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {levels.map((level, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-2 hover:border-indigo-300" onClick={() => startGame(index + 1)}>
              <CardHeader className="text-center">
                <div className="text-5xl mb-3">{level.icon}</div>
                <CardTitle className="text-2xl text-indigo-700">{level.name}</CardTitle>
                <div className={`w-full h-2 rounded-full ${level.color} opacity-20`}></div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{level.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {questions.filter(q => q.level === index + 1).length} questions
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                  Niveau {index + 1} <Target className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <AlertTriangle className="mr-2" size={24} />
                Règles du Jeu
              </h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• 3 vies par niveau - Soyez précis !</li>
                <li>• Temps limité : 60-90s selon la question</li>
                <li>• Évaluation intelligente des réponses ouvertes</li>
                <li>• Bonus de série : +10 points après 3 bonnes réponses</li>
                <li>• Questions basées sur de vrais entretiens Campus France</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Brain className="mr-2" size={24} />
                Système d'Évaluation
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• 🏆 Excellent : Réponse complète et structurée</li>
                <li>• 👍 Très Bien : Quelques détails à ajouter</li>
                <li>• ✅ Bien : Réponse correcte mais perfectible</li>
                <li>• ⚠️ Insuffisant : Réponse trop superficielle</li>
                <li>• ❌ Faible : Réponse inadéquate</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameMode === 'playing') {
    const levelQuestions = questions.filter(q => q.level === currentLevel);
    const question = levelQuestions[currentQuestion];
    
    if (lives <= 0) {
      return (
        <div className="max-w-3xl mx-auto p-6 text-center">
          <div className="text-8xl mb-6">💔</div>
          <h2 className="text-4xl font-bold text-red-600 mb-4">Entretien Terminé</h2>
          <p className="text-xl mb-6">Ne vous découragez pas ! Même les meilleurs candidats ont besoin de s'entraîner.</p>
          <div className="bg-red-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Conseils pour progresser :</h3>
            <ul className="text-red-700 text-left space-y-1">
              <li>• Préparez des réponses structures (introduction, développement, conclusion)</li>
              <li>• Entraînez-vous à parler clairement sous pression</li>
              <li>• Documentez-vous sur votre formation et votre projet</li>
              <li>• Restez authentique et montrez votre motivation</li>
            </ul>
          </div>
          <Button onClick={resetGame} className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3">
            Recommencer l'Entraînement
          </Button>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Star className="text-yellow-500" size={24} />
              <span className="font-bold text-xl">{score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="text-red-500" size={24} />
              <span className="font-bold text-xl">{lives}</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center space-x-2">
                <Flame className="text-orange-500" size={24} />
                <span className="font-bold text-xl">{streak}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="text-blue-500" size={24} />
            <span className={`font-bold text-2xl ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        <Card className="mb-6 border-2 border-indigo-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-2xl flex items-center">
              {levels[currentLevel - 1].icon} 
              <span className="ml-3">Niveau {currentLevel} - Question {currentQuestion + 1}/{levelQuestions.length}</span>
              {question.type === 'pressure_test' && <AlertTriangle className="ml-2 text-red-500" size={24} />}
              {question.type === 'rapid_fire' && <Zap className="ml-2 text-yellow-500" size={24} />}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-xl font-medium mb-6 leading-relaxed">{question.question}</div>
            
            {!showAnswer && (
              <>
                {(question.type === 'multiple_choice' || question.type === 'scenario' || question.type === 'pressure_test') && (
                  <div className="space-y-4">
                    {question.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full text-left justify-start p-6 h-auto text-lg border-2 hover:border-indigo-300 hover:bg-indigo-50"
                        onClick={() => handleAnswer(index)}
                      >
                        <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {(question.type === 'open_ended' || question.type === 'rapid_fire' || question.type === 'ultimate_test' || question.type === 'cultural_test' || question.type === 'ethics_test' || question.type === 'innovation_test') && (
                  <div className="space-y-4">
                    {question.keyPoints && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        💡 <strong>Points clés attendus :</strong> {question.keyPoints.length} éléments importants
                      </div>
                    )}
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Écrivez votre réponse détaillée ici... Soyez précis et structuré !"
                      className="w-full p-4 border-2 border-gray-300 rounded-lg resize-none h-40 text-lg focus:border-indigo-500 focus:outline-none"
                    />
                    <Button 
                      onClick={handleOpenEndedSubmit} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3"
                      disabled={userAnswer.trim().length < 10}
                    >
                      Valider ma réponse ({userAnswer.trim().split(' ').length} mots)
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {