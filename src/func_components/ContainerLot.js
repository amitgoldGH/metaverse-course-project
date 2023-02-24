/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, createElement } from 'react';
import {
  ROW_SIZE,
  COL_SIZE,
  DEFAULT_OWNER,
  TYPE_PARK,
  COLOR_INT_PARK,
  COLOR_PARK,
  GAMELOT_UPDATE,
  TYPE_ROAD,
  COLOR_INT_ROAD,
  COLOR_ROAD,
  TYPE_LOT,
  COLOR_INT_FS,
  COLOR_FS,
  SET_CLICK_MODE,
  COLOR_MINE,
  COLOR_NFS,
  USER_TYPE_DEALER,
  GAMELOT_BUY
} from '../constants';
import { SERVER_ADDRESS, GAMELOT_ROUTE, NUMBLE_URL } from '../constants';
import './gamelot.css';
import Popup from 'reactjs-popup';
import ReactDOM from 'react-dom/client';
import { useStore } from 'react-redux';
import { createPortal } from 'react-dom';

export function ContainerLot() {
  const store = useStore();

  const [gameArray, setGameArray] = useState([]);
  const [isRunOnce, setIsRunOnce] = useState(false);
  const [lotRoot, setLotRoot] = useState(<div id="lot_div" />);

  useEffect(() => {
    if (!isRunOnce) {
      setIsRunOnce(true);
      loadGameLotsFromDB();
    }
  }, []);

  const loadGameLotsFromDB = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };

    const getFunc = async () => {
      try {
        await fetch(SERVER_ADDRESS + GAMELOT_ROUTE, requestOptions).then((response) => {
          // console.log(response.status);
          if (response.status === 200) {
            response.json().then((data) => {
              let i, j;
              var row_elements = [];
              for (i = 0; i < ROW_SIZE; i++) {
                var lot_elements = [];

                for (j = 0; j < COL_SIZE; j++) {
                  lot_elements.push(
                    <GameLotFunc
                      key={'gamelot-comp-id-' + i * ROW_SIZE + j}
                      data={data[i * ROW_SIZE + j]}
                      className="gameLot"
                    />
                  );
                }
                row_elements.push(
                  React.createElement(
                    'div',
                    { key: 'lot_row-' + i, className: 'lotRow' },
                    lot_elements
                  )
                );
              }

              setLotRoot(React.createElement('div', { id: 'root_div' }, row_elements));
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };
    getFunc();
  };

  return (
    <div className="ContainerLot">
      <div style={{ margin: '5%' }}>
        <div className="legend">
          <label>COLOR LEGEND</label>
          <ul>
            <li style={{ color: COLOR_ROAD }}>{COLOR_ROAD}: ROAD</li>
            <li style={{ color: COLOR_PARK }}>{COLOR_ROAD}: PARK</li>
            <li style={{ color: COLOR_FS }}>{COLOR_FS}: FOR SALE</li>
            <li style={{ color: COLOR_NFS }}>{COLOR_NFS}: NOT FOR SALE</li>
            <li style={{ color: COLOR_MINE }}>{COLOR_MINE}: MY OWNED GAME LOT</li>
          </ul>
        </div>
      </div>
      {lotRoot}
    </div>
  );
}

export function GameLotFunc(props) {
  const store = useStore();
  const [myState, setState] = useState(props.data);
  const [updatedState, setUpdatedState] = useState(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [open, setOpen] = useState();
  const [myColor, setMyColor] = useState('gray');
  const [authorizedUser, setAuthorizedUser] = useState({ name: '', type: '' });
  const [gameLaunched, setGameLaunched] = useState(false);

  useEffect(() => {
    let storeState = store.getState();
    let userToken = JSON.parse(localStorage.getItem('token'));
    setAuthorizedUser({ name: userToken.username.toLowerCase(), type: userToken.type });
    if (myState.type === TYPE_ROAD) {
      setMyColor(COLOR_ROAD);
    } else if (myState.type === TYPE_PARK) {
      setMyColor(COLOR_PARK);
    } else {
      if (myState.owner_id === storeState.authorizedUser) {
        setMyColor(COLOR_MINE);
      } else if (myState.for_sale == true) {
        setMyColor(COLOR_FS);
      } else setMyColor(COLOR_NFS);
    }
  }, [myState]);

  useEffect(() => {
    if (updatedState) {
      updateWithCurrentState();
      setState(updatedState);
    }
  }, [updatedState]);

  const updateWithCurrentState = () => {
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        owner_id: updatedState.owner_id,
        lot_id: updatedState.lot_id,
        lot_row: updatedState.lot_row,
        lot_col: updatedState.lot_col,
        type: updatedState.type,
        price: updatedState.price,
        for_sale: updatedState.for_sale,
        has_game: updatedState.has_game,
        authorized_user: authorizedUser.name
      })
    };
    const postFunc = async () => {
      try {
        await fetch(SERVER_ADDRESS + GAMELOT_UPDATE, requestOptions).then((response) => {
          // console.log(response.status);
          if (response.status === 200) {
            console.log('in postfunc response 200, lot_id: ', myState.lot_id);
          } else {
            response.json().then((data) => {
              requestUpdatedInformation();
              console.log(data);
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    postFunc();
  };

  const requestUpdatedInformation = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    };
    const getFunc = async () => {
      try {
        await fetch(SERVER_ADDRESS + GAMELOT_ROUTE + myState.lot_id, requestOptions).then(
          (response) => {
            // console.log(response.status);
            if (response.status === 200) {
              console.log('in get updated info response 200, lot_id: ', myState.lot_id);
              response.json().then((data) => {
                console.log(data);
                setState({ ...myState, owner_id: data.owner_id, for_sale: false });
              });
            } else {
              response.json().then((data) => {
                console.log(data);
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    getFunc();
  };

  function copyStyles(src, dest) {
    Array.from(src.styleSheets).forEach((styleSheet) => {
      const styleElement = styleSheet.ownerNode.cloneNode(true);
      styleElement.href = styleSheet.href;
      dest.head.appendChild(styleElement);
    });
    Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
  }

  const RenderInWindow = (props) => {
    const [container, setContainer] = useState(null);
    const newWindow = useRef(window);

    const handleTabClose = (event) => {
      event.preventDefault();

      setOpen(false);
    };

    useEffect(() => {
      const div = document.createElement('div');
      setContainer(div);
    }, []);

    useEffect(() => {
      if (container) {
        newWindow.current = window.open(
          '',
          '',
          'width=' + window.innerWidth + ',height=' + window.innerHeight + ',left=200,top=200'
        );
        // newWindow.current = window.open('', '', 'width=1280,height=768,left=200,top=200');

        newWindow.current.document.body.appendChild(container);
        const curWindow = newWindow.current;
        copyStyles(window.document, curWindow.document);
        curWindow.addEventListener('beforeunload', handleTabClose);

        return () => {
          curWindow.removeEventListener('beforeunload', handleTabClose);

          curWindow.close();
        };
      }
    }, [container]);

    return container && createPortal(props.children, container);
  };

  const onClicky = () => {
    console.log('Clicked lot id: ', myState.lot_id);
    //setOpen(!open);
    setOpen(true);
  };

  const handleBuyLand = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        authorized_user: authorizedUser.name
      })
    };
    const postFunc = async () => {
      try {
        await fetch(SERVER_ADDRESS + GAMELOT_BUY + myState.lot_id, requestOptions).then(
          (response) => {
            // console.log(response.status);
            if (response.status === 200) {
              console.log('in buy response 200, lot_id: ', myState.lot_id);
              requestUpdatedInformation();
            } else {
              response.json().then((data) => {
                console.log(data);
              });
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    postFunc();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.price.value == '') e.target.price.value = 0;
    if (e.target.new_owner.value != '') {
      setUpdatedState({
        ...myState,
        owner_id: e.target.new_owner.value,
        price: e.target.price.value,
        has_game: e.target.has_game.checked,
        for_sale: e.target.for_sale.checked
      });
    } else {
      setUpdatedState({
        ...myState,
        price: e.target.price.value,
        has_game: e.target.has_game.checked,
        for_sale: e.target.for_sale.checked
      });
    }
  };

  return (
    <div
      key={'lot-id-' + myState.lot_id}
      className="gameLot"
      onClick={onClicky}
      style={{ backgroundColor: myColor }}>
      {open && (
        <RenderInWindow myState={myState}>
          <div className="popUpWindow">
            <div className="game-info">
              <div className="public-game-info">
                <label>Game lot information</label>
                <ul>
                  <li>Lot ID: {myState.lot_id}</li>
                  <li>Lot Type: {myState.type}</li>
                  <li>Lot Owner: {myState.owner_id}</li>
                  <li>For Sale: {myState.for_sale ? 'Yes' : 'No'}</li>
                  <li>Price: {myState.price}</li>
                  {authorizedUser.type == USER_TYPE_DEALER &&
                    authorizedUser.name != myState.owner_id && (
                      <button onClick={handleBuyLand}>BUY GAME LOT</button>
                    )}
                </ul>
              </div>

              {myState.owner_id === authorizedUser.name && (
                <div key={'lot-control-div'} className="control-div">
                  <label>Owner controls</label>
                  <form onSubmit={handleSubmit} className="control-form">
                    <ul>
                      <li>
                        For sale:
                        <input type="checkbox" defaultChecked={myState.for_sale} name="for_sale" />
                      </li>
                      <li>
                        Price:
                        <input
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                          defaultValue={myState.price}
                          name="price"
                        />
                      </li>
                      <li>
                        Game enabled:
                        <input type="checkbox" defaultChecked={myState.has_game} name="has_game" />
                      </li>
                      <li>
                        Transfer Ownership:
                        <input type="text" name="new_owner" />
                      </li>
                    </ul>
                    <button type="submit">Submit</button>
                  </form>
                </div>
              )}
            </div>
            {myState.has_game && (
              <div className="game-div">
                <iframe src={NUMBLE_URL} width="600" height={window.innerHeight}></iframe>
                {/* <iframe src={NUMBLE_URL} width="600" height="800"></iframe> */}
              </div>
            )}
          </div>
        </RenderInWindow>
      )}
    </div>
  );

  //   const setToGrass = () => {
  //     setState({
  //       ...myState,
  //       owner_id: DEFAULT_OWNER,
  //       type: TYPE_PARK,
  //       color_int: COLOR_INT_PARK,
  //       color: COLOR_PARK,
  //       price: 0,
  //       for_sale: false,
  //       has_game: false
  //     });

  //     const requestOptions = {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //       },
  //       body: JSON.stringify({
  //         owner_id: DEFAULT_OWNER,
  //         lot_id: myState.lot_id,
  //         lot_row: myState.lot_row,
  //         lot_col: myState.lot_col,
  //         type: TYPE_PARK,
  //         color_int: COLOR_INT_PARK,
  //         color: COLOR_PARK,
  //         price: 0,
  //         for_sale: false,
  //         has_game: false
  //       })
  //     };
  //     const postFunc = async () => {
  //       try {
  //         await fetch(SERVER_ADDRESS + GAMELOT_UPDATE, requestOptions).then((response) => {
  //           // console.log(response.status);
  //           if (response.status === 200) {
  //             console.log('in postfunc response 200, lot_id: ', myState.lot_id);
  //           } else {
  //             response.json().then((data) => {
  //               console.log(data);
  //             });
  //           }
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     postFunc();
  //   };

  //   const setToRoad = () => {
  //     setState({
  //       ...myState,
  //       owner_id: DEFAULT_OWNER,
  //       type: TYPE_ROAD,
  //       color_int: COLOR_INT_ROAD,
  //       color: COLOR_ROAD,
  //       price: 0,
  //       for_sale: false,
  //       has_game: false
  //     });

  //     const requestOptions = {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //       },
  //       body: JSON.stringify({
  //         owner_id: DEFAULT_OWNER,
  //         lot_id: myState.lot_id,
  //         lot_row: myState.lot_row,
  //         lot_col: myState.lot_col,
  //         type: TYPE_ROAD,
  //         color_int: COLOR_INT_ROAD,
  //         color: COLOR_ROAD,
  //         price: 0,
  //         for_sale: false,
  //         has_game: false
  //       })
  //     };
  //     const postFunc = async () => {
  //       try {
  //         await fetch(SERVER_ADDRESS + GAMELOT_UPDATE, requestOptions).then((response) => {
  //           // console.log(response.status);
  //           if (response.status === 200) {
  //             console.log('in postfunc response 200, lot_id: ', myState.lot_id);
  //           } else {
  //             response.json().then((data) => {
  //               console.log(data);
  //             });
  //           }
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     postFunc();
  //   };

  //   const setToLot = () => {
  //     var priceRan = Math.floor(Math.random() * 200 + 15);
  //     setState({
  //       ...myState,
  //       owner_id: DEFAULT_OWNER,
  //       type: TYPE_LOT,
  //       color_int: COLOR_INT_FS,
  //       color: COLOR_FS,
  //       price: priceRan,
  //       for_sale: true,
  //       has_game: false
  //     });

  //     const requestOptions = {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/json'
  //       },
  //       body: JSON.stringify({
  //         owner_id: DEFAULT_OWNER,
  //         lot_id: myState.lot_id,
  //         lot_row: myState.lot_row,
  //         lot_col: myState.lot_col,
  //         type: TYPE_LOT,
  //         color_int: COLOR_INT_FS,
  //         color: COLOR_FS,
  //         price: priceRan,
  //         for_sale: true,
  //         has_game: false
  //       })
  //     };
  //     const postFunc = async () => {
  //       try {
  //         await fetch(SERVER_ADDRESS + GAMELOT_UPDATE, requestOptions).then((response) => {
  //           // console.log(response.status);
  //           if (response.status === 200) {
  //             console.log('in postfunc response 200, lot_id: ', myState.lot_id);
  //           } else {
  //             response.json().then((data) => {
  //               console.log(data);
  //             });
  //           }
  //         });
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     postFunc();
  //   };
}
