import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '@/modules/header/Header';
import { userStore } from '@/stores/userStore';
import { accountStore } from '@/stores/accountStore';
import styles from './CareerTracksPage.module.scss';

export const CareerTracksPage = observer(() => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; month: string; plan: string; fact: string } | null>(null);

  // Прокрутка в начало страницы при монтировании и загрузка данных пользователя
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Обновляем userStore данными из accountStore (при перезагрузке или переходе)
    userStore.setUserData(
      accountStore.currentAccount.firstName,
      accountStore.currentAccount.lastName,
      accountStore.currentAccount.position
    );
  }, []);
  
  // Состояние для компетенций (какие добавлены в план)
  // Загружаем из localStorage при инициализации
  const [competenciesInPlan, setCompetenciesInPlan] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('competenciesInPlan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return new Set(parsed);
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  });

  const handleAddToPlan = (index: number) => {
    setCompetenciesInPlan(prev => {
      const newSet = new Set(prev).add(index);
      // Сохраняем в localStorage
      localStorage.setItem('competenciesInPlan', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleRemoveFromPlan = (index: number) => {
    setCompetenciesInPlan(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Сохраняем в localStorage
      localStorage.setItem('competenciesInPlan', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  // Данные для компетенций
  const competencies = [
    { 
      name: 'Аналитическое мышление', 
      current: 3, 
      required: 4, 
      note: 'Эта компетенция соответствует твоему профилю',
      isNew: false,
      progress: 30,
      recommendations: {
        courses: ['Курс аналитического мышления 1', 'Курс аналитического мышления 2'],
        books: ['Книга по аналитике'],
        projects: ['Подать заявку на синертим']
      }
    },
    { 
      name: 'Управление проектами', 
      current: 3, 
      required: 3, 
      note: 'Эта компетенция соответствует твоему профилю',
      isNew: false,
      progress: 0,
      recommendations: {
        courses: ['Управление проектами для аналитиков'],
        books: ['PMBOK для начинающих'],
        projects: []
      }
    },
    { 
      name: 'Коммуникации', 
      current: 5, 
      required: 4, 
      note: 'Эта компетенция соответствует твоему профилю',
      isNew: false,
      progress: 0,
      recommendations: {
        courses: [],
        books: [],
        projects: []
      }
    },
    { 
      name: 'Архитектура систем', 
      current: 0, 
      required: 4, 
      note: 'Это новая компетенция для тебя, обрати внимание',
      isNew: true,
      progress: 10,
      recommendations: {
        courses: ['Основы архитектуры систем'],
        books: ['Архитектура корпоративных систем', 'Проектирование систем'],
        projects: []
      }
    }
  ];

  // Данные для графика
  const chartData = [
    { month: 'янв', fullMonth: 'Январь', plan: 17, fact: 16, x: 80 },
    { month: 'фев', fullMonth: 'Февраль', plan: 19, fact: 18.1, x: 175 },
    { month: 'мар', fullMonth: 'Март', plan: 20, fact: 19, x: 270 },
    { month: 'апр', fullMonth: 'Апрель', plan: 21, fact: 19.1, x: 365 },
    { month: 'май', fullMonth: 'Май', plan: 22, fact: 21, x: 460 },
    { month: 'июнь', fullMonth: 'Июнь', plan: 23, fact: 23.9, x: 555 },
    { month: 'июль', fullMonth: 'Июль', plan: 24, fact: 24.3, x: 650 },
    { month: 'авг', fullMonth: 'Август', plan: 25, fact: 24.1, x: 745 },
    { month: 'сен', fullMonth: 'Сентябрь', plan: 26, fact: 24.2, x: 840 },
    { month: 'окт', fullMonth: 'Октябрь', plan: 27, fact: 26, x: 935 },
    { month: 'ноя', fullMonth: 'Ноябрь', plan: 28, fact: null, x: 1030 },
    { month: 'дек', fullMonth: 'Декабрь', plan: 30, fact: null, x: 1125 }
  ];

  // Функция для преобразования процента в Y координату
  // Диапазон: 16% -> 290, 30% -> 10
  // Формула: y = 290 - ((процент - 16) / (30 - 16) * (290 - 10))
  const percentToY = (percent: number) => {
    return 290 - ((percent - 16) / 14 * 280);
  };

  const handleMouseEnter = (data: typeof chartData[0]) => {
    if (data.fact === null) return;
    const yCoord = percentToY(data.fact);
    setTooltip({
      visible: true,
      x: data.x,
      y: yCoord,
      month: data.fullMonth,
      plan: `${data.plan}%`,
      fact: `${data.fact}%`
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // Генерируем path для линии План
  const planPath = chartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${d.x},${percentToY(d.plan)}`
  ).join(' ');

  // Генерируем path для линии Факт (только до октября)
  const factData = chartData.filter(d => d.fact !== null);
  const factLine = factData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${d.x},${percentToY(d.fact!)}`
  ).join(' ');
  
  // Генерируем path для заливки Факт
  const factArea = factLine + ' ' + 
    factData.slice().reverse().map(d => `L ${d.x},290`).join(' ') + ' Z';

  return (
    <>
      <Header />
      <div className={`container ${styles.wrapper}`}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <span className="material-icons">arrow_back</span>
          <span>Назад</span>
        </button>

        <div className={styles.content}>
          <h1 className={styles.title}>Карьерные треки</h1>
          <p className={styles.subtitle}>
            Выберите направление развития и узнайте, что нужно для перехода
          </p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Доступные направления</h2>
            
            <div className={styles.directions}>
              <div className={`${styles.directionCard} ${styles.selected}`}>
                <span className="material-icons" style={{ fontSize: 20 }}>check_circle</span>
                Бизнес-аналитик
              </div>
            </div>
          </section>

          <section className={styles.comparisonSection}>
            <div className={styles.comparisonCard}>
              <div className={styles.currentPosition}>
                <div className={styles.starIconWrapper}>
                  <span className="material-icons" style={{ fontSize: 28 }}>star</span>
                </div>
                <div className={styles.badgeTop}>Текущая должность</div>
                <h3 className={styles.positionTitle}>Специалист по работе с данными</h3>
                <p className={styles.positionSubtitle}>
                  ЦКП: Сформированная отчетность вовремя и без ошибок
                </p>
              </div>
            </div>

            <div className={styles.comparisonCard}>
              <div className={styles.targetPosition}>
                <div className={styles.badgeTop}>Целевая должность</div>
                <h3 className={styles.positionTitle}>Бизнес-аналитик</h3>
                <p className={styles.positionSubtitle}>
                  ЦКП: Согласованные технические задания
                </p>
              </div>
            </div>
          </section>

          <section className={styles.readinessSection}>
            <div className={styles.readinessCard}>
              <div className={styles.readinessIcon}>
                <span className="material-icons" style={{ fontSize: 32 }}>layers</span>
              </div>
              <div className={styles.readinessText}>
                <div className={styles.readinessTitle}>Готовность к переходу: 30%</div>
                <div className={styles.readinessSubtitle}>
                  Начните с ключевых компетенций и проектов.
                </div>
              </div>
            </div>
          </section>

          <section className={styles.statsSection}>
            <div className={styles.statsCard}>
              <h2 className={styles.statsTitle}>СТАТИСТИКИ</h2>
              <p className={styles.statsDescription}>
                Чтобы перейти дальше, покажи стабильные результаты выше ожидаемых. 
                Это значит: не просто выполнять задачи, а предлагать решения, улучшения, идеи.
              </p>

              <div className={styles.chartWrapper}>
                <div className={styles.chartHeader}>
                  <div className={styles.chartTitle}>Показатели эффективности</div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendDot} ${styles.legendPlan}`}></div>
                      <span>План</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={`${styles.legendDot} ${styles.legendFact}`}></div>
                      <span>Факт</span>
                    </div>
                  </div>
                </div>

                <div className={styles.chartContainer}>
                  <svg className={styles.chart} viewBox="0 0 1200 340" preserveAspectRatio="xMidYMid meet">
                    {/* Горизонтальные линии сетки - 8 линий с равными интервалами */}
                    <line x1="60" y1="290" x2="1180" y2="290" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="250" x2="1180" y2="250" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="210" x2="1180" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="170" x2="1180" y2="170" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="130" x2="1180" y2="130" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="90" x2="1180" y2="90" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="50" x2="1180" y2="50" stroke="#e5e7eb" strokeWidth="1" />
                    <line x1="60" y1="10" x2="1180" y2="10" stroke="#e5e7eb" strokeWidth="1" />

                    {/* Метки по оси Y - от 16% до 30% с шагом 2% */}
                    <text x="40" y="294" fontSize="11" fill="#9ca3af" textAnchor="end">16%</text>
                    <text x="40" y="254" fontSize="11" fill="#9ca3af" textAnchor="end">18%</text>
                    <text x="40" y="214" fontSize="11" fill="#9ca3af" textAnchor="end">20%</text>
                    <text x="40" y="174" fontSize="11" fill="#9ca3af" textAnchor="end">22%</text>
                    <text x="40" y="134" fontSize="11" fill="#9ca3af" textAnchor="end">24%</text>
                    <text x="40" y="94" fontSize="11" fill="#9ca3af" textAnchor="end">26%</text>
                    <text x="40" y="54" fontSize="11" fill="#9ca3af" textAnchor="end">28%</text>
                    <text x="40" y="14" fontSize="11" fill="#9ca3af" textAnchor="end">30%</text>

                    {/* График План (синяя линия) */}
                    <path
                      d={planPath}
                      fill="none"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />

                    {/* График Факт (зеленая область) - ломаная линия до октября */}
                    <path
                      d={factArea}
                      fill="rgba(52, 211, 153, 0.15)"
                      stroke="none"
                    />
                    <path
                      d={factLine}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                    />

                    {/* Точки на линии План */}
                    {chartData.map((d, idx) => (
                      <circle key={`plan-${idx}`} cx={d.x} cy={percentToY(d.plan)} r="4" fill="#93c5fd" />
                    ))}

                    {/* Точки на линии Факт (только до октября) - с tooltip */}
                    {factData.map((d, idx) => (
                      <circle
                        key={`fact-${idx}`}
                        cx={d.x}
                        cy={percentToY(d.fact!)}
                        r="4"
                        fill="#34d399"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => handleMouseEnter(d)}
                        onMouseLeave={handleMouseLeave}
                      />
                    ))}

                    {/* Tooltip */}
                    {tooltip && (
                      <g>
                        <defs>
                          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1" />
                          </filter>
                        </defs>
                        <rect
                          x={tooltip.x - 75}
                          y={tooltip.y - 85}
                          width="150"
                          height="76"
                          fill="#ffffff"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          rx="8"
                          filter="url(#shadow)"
                        />
                        <text x={tooltip.x - 65} y={tooltip.y - 58} fontSize="16" fontWeight="600" fill="#111827" textAnchor="start">
                          {tooltip.month}
                        </text>
                        <text x={tooltip.x - 65} y={tooltip.y - 36} fontSize="14" fill="#3b82f6" textAnchor="start">
                          План: {tooltip.plan}
                        </text>
                        <text x={tooltip.x - 65} y={tooltip.y - 16} fontSize="14" fill="#34d399" textAnchor="start">
                          Факт: {tooltip.fact}
                        </text>
                      </g>
                    )}

                    {/* Метки месяцев */}
                    <text x="80" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">янв</text>
                    <text x="175" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">фев</text>
                    <text x="270" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">мар</text>
                    <text x="365" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">апр</text>
                    <text x="460" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">май</text>
                    <text x="555" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">июнь</text>
                    <text x="650" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">июль</text>
                    <text x="745" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">авг</text>
                    <text x="840" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">сен</text>
                    <text x="935" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">окт</text>
                    <text x="1030" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">ноя</text>
                    <text x="1125" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">дек</text>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.projectsSection}>
            <div className={styles.projectsCard}>
              <h2 className={styles.projectsMainTitle}>Проекты и внедренные идеи</h2>
              <p className={styles.projectsSubtitle}>
                Для развития и дальнейшего карьерного движения предлагай улучшения, помогай коллегам, развивай компанию!
              </p>

              <div className={styles.projectsCardsGrid}>
                <div className={styles.projectCard}>
                  <div className={styles.projectCardTitle}>Предложения по улучшению</div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Предложено:</span>
                    <span className={styles.projectCardValue}>1</span>
                  </div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Внедрено:</span>
                    <span className={styles.projectCardValue}>0 <span className={styles.projectCardRequired}>(требуется +1)</span></span>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectCardTitle}>Локальные проекты</div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Начато:</span>
                    <span className={styles.projectCardValue}>2</span>
                  </div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Завершено:</span>
                    <span className={styles.projectCardValue}>1 <span className={styles.projectCardRequired}>(требуется +1)</span></span>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectCardTitle}>Синертимы</div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Принято участие:</span>
                    <span className={styles.projectCardValue}>0 <span className={styles.projectCardRequired}>(требуется +1)</span></span>
                  </div>
                </div>

                <div className={styles.projectCard}>
                  <div className={styles.projectCardTitle}>Наставничество</div>
                  <div className={styles.projectCardRow}>
                    <span className={styles.projectCardLabel}>Кол-во подопечных:</span>
                    <span className={styles.projectCardValue}>1 <span className={styles.projectCardSuccess}>(требование выполнено)</span></span>
                  </div>
                </div>
              </div>

              <div className={styles.projectsWarning}>
                <span className="material-icons" style={{ fontSize: 20 }}>warning</span>
                <span>Нужно внедрить 1 идею, завершить еще 1 проект и принять участие в синертиме</span>
              </div>
            </div>
          </section>

          <section className={styles.competenciesSection}>
            <div className={styles.competenciesCard}>
              <h2 className={styles.competenciesTitle}>Компетенции</h2>
              <p className={styles.competenciesSubtitle}>
                Для развития и дальнейшего карьерного движения прокачивай свои компетенции!
              </p>

              <div className={styles.competenciesTable}>
                <div className={styles.competenciesHeader}>
                  <div className={styles.colCompetency}>Компетенция</div>
                  <div className={styles.colCurrent}>Текущий</div>
                  <div className={styles.colRequired}>Требуется</div>
                  <div className={styles.colGap}>Разрыв</div>
                  <div className={styles.colAction}>Действие</div>
                </div>

                {competencies.map((comp, index) => {
                  const gap = comp.current - comp.required;
                  const isReady = gap >= 0;
                  const isInPlan = competenciesInPlan.has(index);

                  return (
                    <div key={index} className={styles.competenciesRow}>
                      <div className={styles.colCompetency}>
                        <div className={styles.competencyName}>{comp.name}</div>
                        <div className={styles.competencyNote}>{comp.note}</div>
                      </div>
                      <div className={styles.colCurrent}>
                        <span className={styles.competencyValue}>{comp.current}/5</span>
                      </div>
                      <div className={styles.colRequired}>
                        <span className={styles.competencyValue}>{comp.required}/5</span>
                      </div>
                      <div className={styles.colGap}>
                        <span className={`${styles.gapValue} ${gap > 0 ? styles.gapPositive : gap < 0 ? styles.gapNegative : styles.gapZero}`}>
                          {gap > 0 ? `+${gap}` : gap}
                        </span>
                      </div>
                      <div className={styles.colAction}>
                        {isReady ? (
                          <div className={styles.readyBadge}>
                            <span className="material-icons" style={{ fontSize: 16 }}>check</span>
                            <span>Готово</span>
                          </div>
                        ) : (
                          <button 
                            className={`${styles.addToPlanBtn} ${isInPlan ? styles.inPlan : ''}`}
                            onClick={() => handleAddToPlan(index)}
                            disabled={isInPlan}
                          >
                            {isInPlan ? '+ В плане' : '+ В план'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={styles.developmentPlanSection}>
            <div className={styles.developmentPlanCard}>
              <h2 className={styles.developmentPlanTitle}>
                План карьерного развития на позицию «Бизнес-аналитик»
              </h2>
              <p className={styles.developmentPlanSubtitle}>
                Ты можешь развиваться в этом направлении в качестве кадрового резерва
              </p>

              {competenciesInPlan.size === 0 ? (
                <div className={styles.emptyPlanMessage}>
                  Добавьте компетенции из таблицы выше, нажав кнопку "+ В план"
                </div>
              ) : (
                <div className={styles.recommendationsList}>
                  {Array.from(competenciesInPlan).map((index) => {
                    const comp = competencies[index];
                    const hasRecommendations = 
                      comp.recommendations.courses.length > 0 ||
                      comp.recommendations.books.length > 0 ||
                      comp.recommendations.projects.length > 0;

                    if (!hasRecommendations) return null;

                    return (
                      <div key={index} className={styles.recommendationBlock}>
                        <button 
                          className={styles.removeBtn}
                          onClick={() => handleRemoveFromPlan(index)}
                          title="Удалить из плана"
                        >
                          <span className="material-icons" style={{ fontSize: 20 }}>close</span>
                        </button>
                        <h3 className={styles.recommendationTitle}>{comp.name}</h3>

                        {comp.recommendations.courses.length > 0 && (
                          <div className={styles.recommendationSection}>
                            <div className={styles.recommendationLabel}>
                              <span className="material-icons" style={{ fontSize: 18 }}>school</span>
                              <span>Курсы:</span>
                            </div>
                            <div className={styles.recommendationItems}>
                              {comp.recommendations.courses.map((course, i) => (
                                <span key={i} className={styles.recommendationItem}>
                                  {course}
                                  {i < comp.recommendations.courses.length - 1 && ' / '}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {comp.recommendations.books.length > 0 && (
                          <div className={styles.recommendationSection}>
                            <div className={styles.recommendationLabel}>
                              <span className="material-icons" style={{ fontSize: 18 }}>menu_book</span>
                              <span>Книги:</span>
                            </div>
                            <div className={styles.recommendationItems}>
                              {comp.recommendations.books.map((book, i) => (
                                <span key={i} className={styles.recommendationItem}>
                                  {book}
                                  {i < comp.recommendations.books.length - 1 && ' / '}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {comp.recommendations.projects.length > 0 && (
                          <div className={styles.recommendationSection}>
                            <div className={styles.recommendationLabel}>
                              <span className="material-icons" style={{ fontSize: 18 }}>work</span>
                              <span>Проекты:</span>
                            </div>
                            <div className={styles.recommendationItems}>
                              {comp.recommendations.projects.map((project, i) => (
                                <span key={i} className={styles.recommendationItem}>
                                  {project}
                                  {i < comp.recommendations.projects.length - 1 && ' / '}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Прогресс бар */}
                        <div className={styles.progressSection}>
                          <div className={styles.progressHeader}>
                            <span className={styles.progressLabel}>Прогресс освоения</span>
                            <span className={styles.progressPercent}>{comp.progress}%</span>
                          </div>
                          <div className={styles.progressBarBg}>
                            <div 
                              className={styles.progressBarFill} 
                              style={{ width: `${comp.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
});

