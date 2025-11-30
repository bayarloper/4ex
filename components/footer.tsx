"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-sm">4EX</span>
              </div>
              <span className="text-lg font-bold text-foreground">Pedia</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Форекс ICT аргачлалд суурилсан мэдлэгийн сангийн платформ.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Үйлчилгээ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/posts" className="hover:text-primary transition-colors">
                  Нийтлэл
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Бүртгүүлэх
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Гишүүн болох
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Мэдээлэл</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Бидний тухай
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Холбоо барих
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Хамтран ажиллах
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Хууль эрх зүй</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Нууцлалын бодлого
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Үйлчилгээний нөхцөл
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col justify-between items-center py-8 text-sm text-muted-foreground">
          <p>&copy; {currentYear} Бүх эрх хуулиар хамгаалагдсан.</p>  
        </div>
      </div>
    </footer>
  );
}
