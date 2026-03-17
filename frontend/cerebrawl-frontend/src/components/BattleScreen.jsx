import "./BattleScreen.css";

export default function BattleScreen() {
  const player = {
    name: "StudyMon",
    level: 42,
    hp: 83,
    maxHp: 83,
    sprite: "/player-back.png",
  };

  const enemy = {
    name: "EnemyMon",
    level: 17,
    hpPercent: 78,
    sprite: "/enemy-front.png",
  };

  return (
    <div className="battle-screen">
      <div className="battle-field">
        <div className="enemy-side">
          <div className="info-card enemy-card">
            <div className="card-top">
              <span className="mon-name">{enemy.name}</span>
              <span className="mon-level">Lv.{enemy.level}</span>
            </div>

            <div className="hp-row">
              <span className="hp-label">HP</span>
              <div className="hp-bar">
                <div
                  className="hp-fill"
                  style={{ width: `${enemy.hpPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="enemy-platform"></div>
          <img className="enemy-sprite" src={enemy.sprite} alt="Enemy" />
        </div>

        <div className="player-side">
          <div className="player-platform"></div>
          <img className="player-sprite" src={player.sprite} alt="Player" />

          <div className="info-card player-card">
            <div className="card-top">
              <span className="mon-name">{player.name}</span>
              <span className="mon-level">Lv.{player.level}</span>
            </div>

            <div className="hp-row">
              <span className="hp-label">HP</span>
              <div className="hp-bar">
                <div className="hp-fill" style={{ width: "100%" }}></div>
              </div>
            </div>

            <div className="hp-text">
              {player.hp}/{player.maxHp}
            </div>
          </div>
        </div>
      </div>

      <div className="battle-ui">
        <div className="dialogue-box">
          <p>Question?</p>
        </div>

        <div className="action-grid">
          <button>FIGHT</button>
          <button>BAG</button>
          <button>ITEM</button>
          <button>RUN</button>
        </div>
      </div>
    </div>
  );
}