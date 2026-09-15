export interface DealerConfig {
  zoNumber: string;
  dealerName: string;
  businessName: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  siteUrl: string;
  tagline: string;
  amsoilLinks: {
    home: string;
    vehicleLookup: string;
    preferredCustomer: string;
    becomeDealer: string;
    commercial: string;
    retailAccount: string;
    freeCatalog: string;
    login: string;
    allProducts: string;
  };
}

export const dealerConfig: DealerConfig = {
  zoNumber: "1234567", // Placeholder ZO number - easily updated via env var or config
  dealerName: "Brandon Miller",
  businessName: "Brandon's Synthetic Oil",
  title: "AMSOIL Authorized Independent Dealer",
  phone: "(555) 321-4567",
  email: "brandon@brandonsoil.jacobmiller22.com",
  location: "Serving Customers Nationwide (US & Canada)",
  siteUrl: "https://brandonsoil.jacobmiller22.com",
  tagline: "Save up to 25% on Factory-Direct AMSOIL Synthetic Lubricants & Filters",
  amsoilLinks: {
    home: "https://www.amsoil.com/",
    vehicleLookup: "https://www.amsoil.com/guides/",
    preferredCustomer: "https://www.amsoil.com/offers/pc/",
    becomeDealer: "https://www.amsoil.com/become-a-dealer/",
    commercial: "https://www.amsoil.com/business-opportunities/commercial-accounts/",
    retailAccount: "https://www.amsoil.com/business-opportunities/retail-accounts/",
    freeCatalog: "https://www.amsoil.com/free-catalog/",
    login: "https://www.amsoil.com/login/",
    allProducts: "https://www.amsoil.com/c/products/1/"
  }
};

/**
 * Builds an official AMSOIL URL appended with the dealer's ZO referral code.
 */
export function getAmsoilUrl(pathOrUrl: string, zo: string = dealerConfig.zoNumber): string {
  let url = pathOrUrl;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    url = `https://www.amsoil.com${cleanPath}`;
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}zo=${zo}`;
}
