const About = () => {
    return (
        <div style={styles.container}>
            <h2>About Us</h2>
            <p>This is the about page of My Vital Mate!</p>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center' as 'center',  // Type assertion to specify a valid value
    }
};


export default About;
