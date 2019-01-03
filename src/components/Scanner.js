import React from "react";
import Quagga from 'quagga';
import PropTypes from 'prop-types';

class Scanner extends React.Component {
    constructor(props) {
        super(props);
        this._onDetected = this._onDetected.bind(this);
    }

    render() {
        return (
            <div id="interactive" className="viewport"/>
        );
    }

    componentDidMount() {
        Quagga.init({
            inputStream: {
                type : "LiveStream",
                constraints: {
                    width: 640,
                    height: 480,
                    facingMode: "environment", // or user
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 1,
            decoder: {
                readers : ["ean_reader"]
            },
            locate: true
        }, function(err) {
            if (err) {
                return console.log(err);
            }
            Quagga.start();
        });
        Quagga.onDetected(this._onDetected);
    }

    componentWillUnmount() {
        Quagga.offDetected(this._onDetected);
        Quagga.stop();
    }

    _onDetected(result) {
        const drawingCanvas = Quagga.canvas.dom.overlay;
        drawingCanvas.style.display = 'none';
        this.props.onDetected(result);
    }
};

Scanner.propTypes = {
    onDetected: PropTypes.func.isRequired
};

export default Scanner;