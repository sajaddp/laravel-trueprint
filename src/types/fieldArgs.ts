export interface TypeSpecificArgs {
  // Type-specific arguments
  length?: number;
  fixed?: boolean;
  total?: number;
  places?: number;
  enum?: string[];
  set?: string[];
  dimensions?: number;
  subtype?: string;
  srid?: number;
}
