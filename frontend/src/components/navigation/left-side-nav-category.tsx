import { GeneProps, DatasetProps, InferenceStudyProps, AlgorithmProps } from "@/const";

const handleCheckboxChange = (item: GeneProps | DatasetProps | InferenceStudyProps | AlgorithmProps) => {
    console.log(item.pk);
  };

export default function LeftSideNavCategory(props: {
    items: GeneProps[] | DatasetProps[] | InferenceStudyProps[] | AlgorithmProps[], 
    filterItems: any,
    itemsFilter: any,
    setItemsFilter: any,
    categoryName: string,
    type: string,
    icon: any,
    }) {
        return (
            <div className="p-4">
            <div className="sidebar__list">
            <span className="sidebar__icon">
                {props.icon}
            </span>
            <h3 className="sidebar__name">{props.categoryName}</h3>
            </div>
            <div className="sidebar__category__item">
                <input
                type="text"
                className="w-full mb-2 px-2 py-1 rounded sidebar__search"
                placeholder="Search Genes..."
                value={props.itemsFilter}
                onChange={(e) => props.setItemsFilter(e.target.value)}
                />
                {props.filterItems(props.items, props.itemsFilter).map((item: any) => (
                    <div key={props.type + '-' + item.pk} className="flex items-center">
                        <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() => handleCheckboxChange(item)}
                        />
                        <span>{item.name ? item.name : item.title}</span>
                    </div>

                ))}
            </div>
            </div>
        )
  };