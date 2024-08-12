import React from 'react';
import './widgetMouvement.css'; 

function WidgetMouvement({ text, couleur, size }) {
    // Définir les tailles possibles pour chaque format
    const sizeMap = {
        1: { height: '12vh', fontSize: '24px' }, // Taille la plus grande
        2: { height: '10vh', fontSize: '22px' },
        3: { height: '9vh', fontSize: '20px' },
        4: { height: '8vh', fontSize: '18px' },
        5: { height: '7vh', fontSize: '16px' },
        6: { height: '6vh', fontSize: '14px' }  // Taille la plus petite
    };

    // Sélectionner la taille en fonction du paramètre 'size'
    const selectedSize = sizeMap[size] || sizeMap[6]; // Par défaut, utiliser la taille 6 si la taille passée n'est pas valide

    const style = {
        backgroundColor: couleur,
        height: selectedSize.height,
        fontSize: selectedSize.fontSize,
    };

    return (
        <div className='sect-box-mouvement' style={style}>
            <p className='text-box-mouvement'>
                {text}
            </p>
        </div>
    );
}

export default WidgetMouvement;
