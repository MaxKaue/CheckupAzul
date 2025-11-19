import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-col">
          <h3 className="footer-title">Checkup Azul</h3>
          <p className="footer-text">
            MVP Saúde do Homem • Edital Nº 002/2025
          </p>
          <p className="footer-text">
            Projeto acadêmico desenvolvido para o Centro Universitário Maurício de Nassau — UNINASSAU
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-title">Informações</h3>
          <p className="footer-text">4º Período — ADS</p>
          <p className="footer-text">Aracaju • 2025.2</p>
          <p className="footer-text">Uso exclusivo para fins acadêmicos</p>
        </div>

      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Checkup Azul — Todos os direitos reservados.
      </p>
    </footer>
  );
}
