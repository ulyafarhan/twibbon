export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} PTQ Twibbon. Made with 🍵 by Infokom
            PTQ.
          </p>
        </div>
      </div>
    </footer>
  );
}
