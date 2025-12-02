import { ICodexAsset, ICodexAssetDto } from "@interfaces";

export function mapToCodexAssetDto(o: ICodexAsset, isArchived?: (a: ICodexAsset) => boolean): ICodexAssetDto {
  return {
    id: o.id,
    address: o.address,
    chainId: o.chainId,
    name: o.name,
    unitName: o.unitName,
    decimals: o.decimals,
    isGas: o.isGas,
    img: o.img,
    cmcLink: o.cmcLink,
    isArchived: isArchived ? isArchived(o) : false,
  };
}