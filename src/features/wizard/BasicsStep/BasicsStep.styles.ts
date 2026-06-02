import styled from "styled-components";

export const BasicsBody = styled.div`
  display: flex;
  gap: 22px;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PhotoCol = styled.div`
  flex: 0 0 auto;
  width: 124px;
`;

export const FieldsCol = styled.div`
  flex: 1;
  min-width: 240px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AgeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
