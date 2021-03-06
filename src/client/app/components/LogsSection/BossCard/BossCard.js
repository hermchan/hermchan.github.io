import _ from 'lodash'
import axios from 'axios';
import config from 'Config/config.js';
import styles from './BossCard.scss';
import Percentile from '../Percentile/Percentile.js';
import PropTypes from 'prop-types';
import TotalKills from '../TotalKills/TotalKills.js';
import TalentSection from '../TalentSection/TalentSection.js';
import React from 'react';

const wowKey = config.WOW_API_KEY;

class BossCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bossImageUrl : '',
      active: false
    }
    this.checkBosses = this.checkBosses.bind(this);
  }

  componentDidMount() {
    axios.get('https://us.api.battle.net/wow/boss/' + this.props.boss.id + '?locale=en_US&apikey=' + wowKey)
      .then((res) => {
        const creatureDisplayId = _.first(res.data.npcs).creatureDisplayId;
        this.setState({
          bossImageUrl :'https://render-us.worldofwarcraft.com/npcs/zoom/creature-display-' + creatureDisplayId + '.jpg'
        });
      }).catch((err) => {
        console.log(err);
    });
    this.checkBosses();
  }

  checkBosses() {
    const { boss } = this.props;
    const name = _.map(this.props.logs, 'name');
    _.forEach(name, function(value) {
      if (value == boss.name) {
        this.setState({active: true})
      }
    }.bind(this));
  }

  componentWillReceiveProps(props) {
    const name = _.map(props.logs, 'name');
    _.forEach(name, (value) => {
      if (value == props.boss.name) {
        this.setState({active:true});
      }
    })
  }

  render() {
    const { logs } = this.props;
    let result = null;
    _.forEach(logs, (value) => {
      if (value.name == this.props.boss.name) {
        result = value
      }
      return result;
    });

    return (
      <tr>
        <td>
          <img style={{width: '50px', height: '50px'}} src={this.state.bossImageUrl}/>
          <span className={styles.name}>{this.props.boss.name}</span>
        </td>
        { !this.state.active
          ? <td className={styles.tableCenter}><span>x 0</span></td>
          : <TotalKills log={result} />
        }
        { !this.state.active
          ? <td className={styles.tableCenter}><span>-</span></td>
          : <Percentile percent={result} />
        }
        { !this.state.active
          ? <td className={styles.tableCenter}><span>-</span></td>
          : <td className={styles.tableCenter}><TalentSection log={result} /></td>
        }
      </tr>
    )
  }
}

BossCard.propTypes = {
  boss: PropTypes.object.isRequired,
  logs: PropTypes.array.isRequired
};

export default BossCard;
