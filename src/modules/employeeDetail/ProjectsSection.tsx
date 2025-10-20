import { observer } from 'mobx-react-lite';
import styles from './ProjectsSection.module.scss';
import { employeeDetailStore } from '@/stores/employeeDetailStore';
import { ProjectCard } from './ProjectCard';

export const ProjectsSection = observer(() => {
  const items = employeeDetailStore.projectsList;

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <div className={styles.title}>Мои проекты</div>
      </header>

      <div className={styles.list}>
        {items.map((item) => (
          <ProjectCard key={item.guid} item={item} />
        ))}
      </div>
    </section>
  );
});

