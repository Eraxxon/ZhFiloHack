import { observer } from 'mobx-react-lite';
import styles from './ProjectCard.module.scss';
import type { ProjectItem } from '@/stores/employeeDetailStore';

interface Props {
  item: ProjectItem;
}

export const ProjectCard = observer(({ item }: Props) => {
  return (
    <article className={styles.card}>
      <div className={styles.name}>{item.name}</div>
      <div className={styles.ratio}>{item.factNumber}/{item.planNumber}</div>
    </article>
  );
});

