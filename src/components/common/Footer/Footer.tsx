function Footer() {
  return (
    <footer className="bg-gray-800 py-8 text-white">
      <div className="container mx-auto hidden justify-between md:flex">
        {/* 회사 정보 */}
        <div className="mb-6 w-full md:mb-0 md:w-1/3">
          <h4 className="mb-2 text-lg font-semibold">회사 정보</h4>
          <p>회사 이름</p>
          <p>주소: 서울시 강남구...</p>
          <p>전화번호: 02-1234-5678</p>
          <p>이메일: info@company.com</p>
        </div>
        {/* 고객 서비스 */}
        <div className="mb-6 w-full md:mb-0 md:w-1/3">
          <h4 className="mb-2 text-lg font-semibold">고객 서비스</h4>
          <ul className="list-none p-0">
            <li>
              <a href="/terms" className="text-blue-400 hover:underline">
                이용 약관
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-blue-400 hover:underline">
                개인정보 처리방침
              </a>
            </li>
            <li>
              <a href="/faq" className="text-blue-400 hover:underline">
                자주 묻는 질문
              </a>
            </li>
          </ul>
        </div>
        {/* 소셜 미디어 */}
        <div className="w-full md:w-1/3">
          <h4 className="mb-2 text-lg font-semibold">소셜 미디어</h4>
          <ul className="list-none p-0">
            <li>
              <a href="https://facebook.com" className="text-blue-400 hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className="text-blue-400 hover:underline">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://instagram.com" className="text-blue-400 hover:underline">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="block md:hidden">
        <div className="mb-6 w-full text-sm">
          <h4 className="mb-2 font-semibold">회사 정보</h4>
          <p>회사 이름</p>
          <p>주소: 서울시 강남구...</p>
          <p>전화번호: 02-1234-5678</p>
          <p>이메일: info@company.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
