import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './CareerOpportunities.module.scss';
import { accountStore } from '@/stores/accountStore';

export const CareerOpportunities = observer(() => {
  const navigate = useNavigate();
  const isReadOnly = accountStore.isManager;

  const handleClick = () => {
    if (!isReadOnly) {
      navigate('/career-tracks');
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.title}>МОИ КАРЬЕРНЫЕ ВОЗМОЖНОСТИ</div>
      <div className={styles.description}>
        Узнай, какие позиции доступны тебе в рамках твоего карьерного трека.
        <br /><br />
        Сравни свой профиль с целевой должностью и получи персональные рекомендации по развитию.
      </div>
      <button className={styles.button} onClick={handleClick} disabled={isReadOnly}>
        Посмотреть возможности
      </button>
    </section>
  );
});

