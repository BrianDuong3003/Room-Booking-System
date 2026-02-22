import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center">
              <span className="text-xl font-bold text-campus-blue">SCAMS</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Smart Campus Management System
              <br />
              Making campus operations smarter and more efficient
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/#" className="text-sm text-muted-foreground hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/#" className="text-sm text-muted-foreground hover:text-primary">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/#" className="text-sm text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/#" className="text-sm text-muted-foreground hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-muted-foreground">
                  268 Đ. Lý Thường Kiệt, 
                  <br />
                  Phường 14, Quận 10, Hồ Chí Minh
                </li>
                <li className="text-sm text-muted-foreground">
                  BKNetID@hcmut.edu.vn
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Smart Campus System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
