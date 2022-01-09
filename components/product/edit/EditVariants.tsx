import { ProductVariant } from "../../../schema";
import EditVariant from "./EditVariant";
import Pagination from "../../elements/Pagination";
import React, { FunctionComponent, useMemo, useState } from "react";

const EditVariants: FunctionComponent<{
  variants: ProductVariant[];
  itemsPerPage: number;
}> = ({ variants, itemsPerPage }) => {
  const [page, setPage] = useState(0);

  const currentVariants = useMemo(() => {
    return variants.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  }, [page, itemsPerPage]);

  return (
    <div>
      <Pagination
        currentPage={page}
        total={Math.ceil(variants.length / itemsPerPage)}
        setPage={setPage}
      />
      <div>
        {currentVariants.map((variant) => (
          <EditVariant key={variant.sku} variant={variant} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        total={Math.ceil(variants.length / itemsPerPage)}
        setPage={setPage}
      />
    </div>
  );
};

export default EditVariants;
