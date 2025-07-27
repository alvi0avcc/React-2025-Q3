import styles from './about.module.css';
import { NavLink } from 'react-router';

const About = () => {
  return (
    <section className={styles.about}>
      <h2>About</h2>
      <p>
        The application was developed according to an educational assignment.
      </p>
      <a
        href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/functional-routing.md"
        target="blank"
      >
        Task «React: Routing and Hooks»
      </a>
      <p>With respect to you</p>
      <a href="https://github.com/alvi0avcc" target="blank">
        Aleksandr
      </a>
      <br />
      <NavLink className={styles.goHome} to="/" end>
        Back to Home Page
      </NavLink>

      <br />

      <a href="https://rs.school/courses/reactjs" target="blank">
        The Rolling Scopes 2025 - React Course
      </a>
    </section>
  );
};

export default About;
