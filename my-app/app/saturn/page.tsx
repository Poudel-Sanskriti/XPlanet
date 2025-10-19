import SaturnModel from '@/components/SaturnModel';

export default function SaturnPage() {
  return (
    // Main container
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute', width: '100%', height: '100%',
          top: 0, left: 0, objectFit: 'cover', zIndex: -1,
        }}
      >
        <source src="/space_bg.mp4" type="video/mp4" />
      </video>

      {/* Main content layout (model and form) */}
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        
        {/* Left Side: 3D Model */}
        <div style={{ flex: 1, height: '100%' }}>
          <SaturnModel />
        </div>

        {/* Right Side: THE NEW FINANCIAL FORM */}
        <div style={{ flex: 1, padding: '2rem', color: 'white', display: 'flex', 
                      flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
          
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
            Loans & Credit
          </h1>
          <p style={{ marginBottom: '2rem', color: '#ccc' }}>
            Please provide the following information to personalize your financial journey.
          </p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <label>Age</label>
            <input type="number" placeholder="Enter your age" style={inputStyle} />

            <label>Employment Status</label>
            <select style={inputStyle}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Self-employed</option>
              <option>Unemployed</option>
              <option>Student</option>
            </select>

            <label>Housing Situation</label>
            <select style={inputStyle}>
              <option>Rent</option>
              <option>Own</option>
              <option>Live with family</option>
            </select>

            <label>Annual Income Range</label>
            <select style={inputStyle}>
              <option>$0 - $30,000</option>
              <option>$30,001 - $60,000</option>
              <option>$60,001 - $100,000</option>
              <option>$100,001+</option>
            </select>
            
            <button type="submit" style={buttonStyle}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Reusable styles for the form elements to keep the code clean
const inputStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  padding: '12px',
  borderRadius: '5px',
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  color: 'white',
  padding: '12px',
  borderRadius: '5px',
  fontSize: '1.1rem',
  cursor: 'pointer',
  marginTop: '1rem',
  transition: 'background-color 0.3s',
};