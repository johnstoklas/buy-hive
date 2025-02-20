import React, { useEffect, useState, useRef } from 'react';
import SelectFolders from './SelectFolders.jsx';

const MoveItem = ({
    cartsArray,
    cartId,
    itemId,
    item
}) => {
    
    return (
        <section id="move-item-container">
            <div id="move-item-header">
                <h4> Move Item </h4>
                <p> &#10005; </p>
            </div>
            <section class="expand-section-expanded-display move-item-container">
            <div class="shopping-item-container">
            <div class="shopping-item-image-container">
                <img src={item.image}></img>
            </div>
            <div class="shopping-item-information-container">
                <div className="shopping-item-header">
                <div className="shopping-item-header-text">
                    <h4 class="shopping-item-name"> {item.name} </h4>
                    <h4 class="shopping-item-price">  ${item.price} </h4>
                </div>
                </div>
                    <div class="shopping-item-notes" style={{color: item.notes ? "black" : "gray"}}> {item.notes ? item.notes : "None"} </div>
                </div>
            </div>
        </section>
        <SelectFolders
            moveItem={true}
            select
            cartsArray={cartsArray}
            cartId={cartId}
            itemId={itemId}
        />
        <div id="move-button-container">
            <button id="move-item-button"> Confirm Move </button>
        </div>
    </section>
    )
};

export default MoveItem;