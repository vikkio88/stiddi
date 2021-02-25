import { Col, Row, Button } from "components/common";

const presetStyles = {
    small: { width: "50px", border: "solid 1px black" },
    medium: { width: "100px", border: "solid 1px black" },
    big: { width: "150px", border: "solid 1px black" },
};

const BurnPreset = ({ burnTime, throttle, set }) => {
    return (
        <Col className="f-ac f-jc mt-10">
            <h3>Burn Presets</h3>
            <Row full={false}>
                <Button
                    disabled={burnTime >= 10 && throttle >= 100}
                    onClick={() => set({ burnTime: 10, throttle: 100 })}
                    style={presetStyles.medium}
                >
                    Full
                </Button>
                <Button
                    disabled={burnTime === 5 && throttle === 50}
                    onClick={() => set({ burnTime: 5, throttle: 50 })}
                    style={presetStyles.medium}
                >
                    Half
                </Button>
                <Button
                    disabled={burnTime === 1 && throttle === 5}
                    onClick={() => set({ burnTime: 1, throttle: 5 })}
                    style={presetStyles.medium}
                >
                    Min
                </Button>
            </Row>
            <Row full={false}>
                <Button
                    onClick={() => set({ burnTime: 2, throttle: 100 })}
                    style={presetStyles.small}
                >
                    10
                </Button>
                <Button
                    onClick={() => set({ burnTime: 4, throttle: 100 })}
                    style={presetStyles.small}
                >
                    20
                </Button>
                <Button
                    onClick={() => set({ burnTime: 6, throttle: 100 })}
                    style={presetStyles.small}
                >
                    30
                </Button>
                <Button
                    onClick={() => set({ burnTime: 8, throttle: 100 })}
                    style={presetStyles.small}
                >
                    40
                </Button>
                <Button
                    onClick={() => set({ burnTime: 10, throttle: 100 })}
                    style={presetStyles.small}
                >
                    50
                </Button>
            </Row>
            <Button
                onClick={() => {
                    const newBurnTime = Math.max(Math.floor((throttle / 100) * 10), 1);
                    const newThrottle = Math.max(Math.floor((burnTime / 10) * 100), 5);
                    set({
                        burnTime: newBurnTime,
                        throttle: newThrottle
                    });
                }}
                style={presetStyles.big}
            >
                Toggle T/B
            </Button>
        </Col>
    );
};

export default BurnPreset;