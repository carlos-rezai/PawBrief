import styled from "styled-components";

export const ToyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const TreatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
