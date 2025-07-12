import { Component } from 'react';
import styles from './response.module.css';
import type { Spacecraft } from '@/types/types';

type Props = {
  spacecrafts: Spacecraft[];
};

export class ResultsResponse extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.spacecrafts = this.props.spacecrafts;
  }

  private spacecrafts: Spacecraft[];

  render() {
    return (
      <div className={styles.response}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {this.spacecrafts.map(item => (
              <tr key={item.uid}>
                <td>{item.name}</td>
                <td>
                  {item.spacecraftClass?.name
                    ? item.spacecraftClass.name
                    : 'hidden'}
                </td>
                <td>{item.status ? item.status : 'hidden'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
