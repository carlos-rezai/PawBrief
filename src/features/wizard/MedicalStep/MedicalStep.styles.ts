import styled from "styled-components";

export const VetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MedTopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const HealthGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const PrivacyNote = styled.p`
  font-size: 11.5px;
  color: #948675;
  margin: 4px 0 0;
`;
